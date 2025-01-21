@IsTest
public class ContactController_Test {

    
    @IsTest
    public static void testGetContactList(){
        //Create some contact records
        List<Contact> contactsRecords = new List<Contact>();
        for (Integer i = 0; i < 15; i++) {
            contactsRecords.add(new Contact(
                LastName = 'Test Contact ' + i,
                Email = 'test' + i + '@example.com'
            ));
        }
        insert contactsRecords;

        
        Test.startTest();
        List<Contact> contacts = ContactController.getContactList(10,10);
        Integer count = ContactController.getTotalContactCount();
        Test.stopTest();
        
        System.assertEquals(10, contacts.size(), 'The number of returned contacts = the page size.');
        System.assertEquals(15, count, 'Count should equal to the total contact records created');
    }
    
    
      @isTest
    static void testUpdateContactEmail() {
        Contact testContact = new Contact(LastName = 'test Contact', Email = 'test1@example.com');
        insert testContact;

        Test.startTest();
        ContactController.updateContactEmail(testContact.Id, 'test12@example.com');
        Test.stopTest();

        Contact updatedContact = [SELECT Email FROM Contact WHERE Id = :testContact.Id];
        System.assertEquals('test12@example.com', updatedContact.Email, 'contact email should be updated.');
    }

}