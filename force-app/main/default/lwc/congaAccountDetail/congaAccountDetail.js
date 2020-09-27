import {
    LightningElement,
    api,
    wire,
    track
} from 'lwc';
import fetchAccount from '@salesforce/apex/CongaAccountController.fetchAccountData';
import {
    getObjectInfo
} from 'lightning/uiObjectInfoApi';
import Conga_Total_Account_Contacts from '@salesforce/label/c.Conga_Total_Account_Contacts';
import Conga_Customer_Success from '@salesforce/label/c.Conga_Customer_Success';
import Conga_Application_Developer from '@salesforce/label/c.Conga_Application_Developer';
import {
    ShowToastEvent
} from 'lightning/platformShowToastEvent';
var fieldList = ['Name', 'NumberOfEmployees', 'My_Field__c', 'Phone', 'BillingStreet', 'BillingCity', 'BillingState', 'BillingPostalCode'];
var contactFields = ['LastName', 'Title'];
const dataTableColumns = [{
    label: 'Last Name',
    fieldName: 'LastName'
}, {
    label: 'Title',
    fieldName: 'Title'
}]
const customerSuccessTitle = 'Customer Success';
const applicationDeveloperTitle = 'Application Developer';
export default class CongaAccountDetail extends LightningElement {
    @api recordId;
    @api objectApiName;
    @track
    objectFieldsData;
    @track
    recordToDisplay = [];
    @track
    customerSuccessContacts = [];
    @track
    applicationDeveloperContacts = [];
    @track
    customerSuccessTitle;
    @track
    applicationDeveloperTitle;
    dataTableColumns = dataTableColumns;
    /*
     * This method is used to get the object data using uiRecordApi
     */
    @wire(getObjectInfo, {
        objectApiName: '$objectApiName'
    })
    getObjectInfo({
        data,
        error
    }) {
        if (data) {
            this.objectFieldsData = data.fields;
        }
    }

    /*
     *  This method is used to get the Account data from database
     */
    @wire(fetchAccount, {
        recordId: '$recordId',
        fields: fieldList,
        contactFields: contactFields,
        objectName: '$objectApiName'
    })
    wireAccount({
        data,
        error
    }) {
        if (data) {
            fieldList.forEach(eachField => {
                this.recordToDisplay.push({
                    label: this.objectFieldsData[eachField].label,
                    value: data[eachField]
                });
            })
            let contactsFromAccount = data.Contacts;
            this.recordToDisplay.push({
                label: Conga_Total_Account_Contacts,
                value: contactsFromAccount ? contactsFromAccount.length : 0
            });
            if (contactsFromAccount) {
                contactsFromAccount.forEach(eachContact => {
                    if (eachContact.Title === customerSuccessTitle) {
                        this.customerSuccessContacts.push(eachContact);
                    } else if (eachContact.Title === applicationDeveloperTitle) {
                        this.applicationDeveloperContacts.push(eachContact);
                    }
                })
                if (this.customerSuccessContacts.length > 0) {
                    this.customerSuccessTitle = Conga_Customer_Success +
                        ' (' + this.customerSuccessContacts.length + ')'
                }
                if (this.applicationDeveloperContacts.length > 0) {
                    this.applicationDeveloperTitle = Conga_Application_Developer +
                        ' (' + this.applicationDeveloperContacts.length + ')'
                }
            }
        } else {
            this.showToastMessage('', error, 'error');
        }
    }

    /**
     * @description Utility method to show toast
     * @param title  toast title
     * @param message  message to be displayed
     * @param variant  error/success variant
     */
    showToastMessage(title, message, variant) {
        this.dispatchEvent(new ShowToastEvent({
            title: title,
            message: message,
            variant: variant
        }));
    }
}