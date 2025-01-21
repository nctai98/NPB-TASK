import { LightningElement, wire } from 'lwc';
import getContacts from '@salesforce/apex/ContactController.getContactList';
import updateContactEmail from '@salesforce/apex/ContactController.updateContactEmail';
import getTotalContactCount from '@salesforce/apex/ContactController.getTotalContactCount';
import { refreshApex } from '@salesforce/apex';
import { ShowToastEvent } from 'lightning/platformShowToastEvent';

const PAGE_SIZE = 10;

export default class ContactList extends LightningElement {
    contacts = [];
    totalContacts = 0;
    pageNumber = 1;
    pageSize = PAGE_SIZE;
    wiredResult;

    columns = [
        { label: 'Name', fieldName: 'Name', type: 'text' },
        { label: 'Email', fieldName: 'Email', type: 'email', editable: true },
    ];

    @wire(getTotalContactCount)
    wiredTotalContacts(result) {
        if (result.data) {
            console.log('data :' + result.data);
            this.totalContacts = result.data;
        } else if (result.error) {
            console.error('error fetching contacts:', result.error);
        }
    }

    @wire(getContacts, { pageNumber: '$pageNumber', pageSize: '$pageSize' })
    wiredContacts(result) {
        this.wiredResult = result; 
        if (result.data) {
            this.contacts = result.data;
        } else if (result.error) {
            console.error('error fetching contacts:', result.error);
        }
    }

    async handleCellChange(event) {
        const { draftValues } = event.detail;

        if (draftValues && draftValues.length > 0) {
            const { Id, Email } = draftValues[0]; 
            try {
                await updateContactEmail({ contactId: Id, email: Email });
                await refreshApex(this.wiredResult);
                this.template.querySelector('lightning-datatable').draftValues = [];
                this.showToast('Success', 'Email updated successfully', 'success');
            } catch (error) {
                console.error('Error updating email:', error);
                this.showToast('Error', 'Failed to update email', 'error');
            }
        }
    }
    handlePrevious() {
        if (this.pageNumber > 1) {
            this.pageNumber--;
            refreshApex(this.wiredResult);
        }
    }
    handleNext() {
        if (this.pageNumber < this.totalPages) {
            this.pageNumber++;
            refreshApex(this.wiredResult);
        }
    }

    get totalPages() {
        return Math.ceil(this.totalContacts / this.pageSize);
    }

    get disablePrevious() {
        return this.pageNumber <= 1;
    }

    get disableNext() {
        return this.pageNumber >= this.totalPages;
    }

    showToast(title, message, variant) {
        this.dispatchEvent(
            new ShowToastEvent({
                title,
                message,
                variant
            })
        );
    }
}