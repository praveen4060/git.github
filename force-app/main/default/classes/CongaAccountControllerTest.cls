/**
 * @group Test Class. 
 * @description This is the test Class for CongaAccountController Class
 */
@isTest
public class CongaAccountControllerTest {
   private static String accountName = 'Test Account ' + CongaAccountControllerTest.class.getName();
  /**
   * @description This method is used for creating setup date for Test Class.
   */
    @testSetup static void setup() {
        Account newAccount = new Account(Name=accountName, Phone='7506948124');
        insert newAccount;
        Contact newContact = new Contact(AccountId=newAccount.Id, LastName='Contact '+ accountName, Title=Label.Conga_Total_Account_Contacts);
        insert newContact;
    }

  /**
   * @description This test method ensures fetchAccountData method is returning Account with fields passed in.
   */
    @isTest static void checkIffetchAccountDataIsReturningAccountData() {
      Account testAccount = getAccount(accountName);
      Test.startTest();
        Account accountFromController = CongaAccountController.fetchAccountData(testAccount.Id,
            new List<String>{'Name', 'Phone'}, new List<String>{'LastName', 'Title'},'Account');
      Test.stopTest();
      System.assertEquals(testAccount.Name, accountFromController.Name, 'InCorrect Account Returned');
      System.assertEquals(testAccount.Phone, accountFromController.Phone, 'InCorrect Account Returned');
    }

  /**
   * @description This test method ensures fetchAccountData method is throwing error with invalid data.
   */
    @isTest static void checkIffetchAccountDataIsThrowingErrorWithInvalidAccountData() {
      Account testAccount = getAccount(accountName);
      Exception exMsg= null;
      Test.startTest();
      try{
        Account accountFromController = CongaAccountController.fetchAccountData(testAccount.Id,
            new List<String>{'Name', 'Phone'}, new List<String>{'LastName', 'Title'},'Contact');    
      } Catch(Exception ex) {
        exMsg = ex;
      }
      Test.stopTest();
      System.assertEquals('System.AuraHandledException', exMsg.getTypeName(),'Exception was not thrown by the controller');
    }
    
  /**
   * @description Method to return Account Data
   * @param accName
   * @return Account
   */
  private
  static Account getAccount(String accName) {
    // clang-format off
    Account accRecord = [
        SELECT
          Id,
          Name,
          Phone
        FROM
          Account
        WHERE
          Name =: accName
    ];
    // clang-format on
    return accRecord;
  }
}