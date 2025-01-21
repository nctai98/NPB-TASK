public with sharing class ContactController {
    
    //get contacts records for each page, offset by number of records in previous pages
    @AuraEnabled(cacheable=true)
    public static List<Contact> getContactList(Integer pageNumber, Integer pageSize){
        Integer offsetValue = (pageNumber - 1) * pageSize;
        return [SELECT Id, Name, Email FROM Contact ORDER BY NAME ASC LIMIT :pageSize OFFSET :offsetValue];
    }
    
    //update contact email with new email
    @AuraEnabled
        public static void updateContactEmail(Id contactId, String email) {
        Contact contactToUpdate = [SELECT Id, Email FROM Contact WHERE Id = :contactId LIMIT 1];
        contactToUpdate.Email = email;
        update contactToUpdate;
    }
    
    //get total of contact records
    @AuraEnabled(cacheable=true)
    public static Integer getTotalContactCount() {
        return [SELECT COUNT() FROM Contact];
    }


}