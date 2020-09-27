public class CongaAccountController {
    
/**
 * @group CongaAccountController
 * @description This class called from LWC for fectching Account Data.
 */
@AuraEnabled(cacheable=true)
  /**
   * @description This method is to get the data from Account.
   * @param recordId
   * @param fields
   * @param contactFields
   * @param objectName
   * @return Account
   */
    public static Account fetchAccountData(String recordId, List<String> fields, List<String> contactFields, String objectName){
         String query='SELECT '+string.join(fields, ',');
         query += ', (SELECT '+String.join(contactFields, ',') +' FROM Contacts) ';
         query += ' FROM ' + objectName + ' WHERE Id =: recordId';
        Account accData = null;
        try {
          accData = (Account)Database.query(query); 
        } Catch(Exception ex) {
          throw new AuraHandledException('Account data retrieval failed due to ' + ex.getMessage());
        }
        return accData;
    }
}