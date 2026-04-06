# Markdown Tests for Logged In User Checkout Flow
## Table of Contents
1. [Title](#title)  
2. [Preconditions](#precondition) 
3. [Test Data](#test-data)   
4. [Steps (Numbered Listing with step description)]    
5. [Assertions (Bulleted list of expected results or behavioural outcomes for the test.)]  
6.[References & Further Reading.](#refsAndFurtherReading) 
7. [Appropriate terminology and Acronym definitions](#terminologiesAcronymDefinitions).   
8. [Notes on Testing Methods (e.g., Manual, Auto-testing)]  
9.[Expected Behavioural Outcomes]    
10[Steps for Further Modification or Extension]. 
## Title<a name="title"/>
The test plan to checkout process with a logged in user using Playwright tool.   
## Preconditions <a name = "precondition "/> 
We have an active account on the platform, and we are already signed into our browser for testing purposes via playwrigth scripting interface tools which includes logging-in functionality such as email & password or social media login (like Google/Facebook).   
## Test Data <a name = "testData "/> 
1. Email: a valid registered user's mail id in the platform  
2. Password : A strong, randomly generated one for each test case    
3. Street address — with city and state (can be any)      
4. Zip code - can also include country/state   
5. Phone number: a valid registered user's phone no in the platform  
## Steps <a name = "steps"/> 
1. Open browser(Chrome or Firefox). 
2. Go to url of web app (platform) and sign into account using pre-defined login credentials by Playwright scripting interface tools such as email & password, facebook/google etc .   
3. Click on 'Checkout' button in the application user profile menu located at top right corner after successful logging  successfully complete it with valid test data (email ,password).  
4. Fill-in all order details like shipping address information(street name along side city and state), zip code/country, phone number etc .   
5. Proceed to payment by selecting any method from dropdown list of available methods in checkout page including cash on delivery mode  or various other card / internet banking options  
6. Confirm the order once all details are filled correctly with accurate test data and click 'place order' button at last step   
7. Verify if Order has been successfully placed by clicking a confirmation link provided to us in email (usually) after successful payment, confirming that it’s confirmed from user side as well  
8. Log out of the platform account for cleanup activities  .    
## Assertions <a name = "assertion"/>   
1. User should be able successfully place order and get confirmation mail with correct details regarding their purchased product or service via registered email id after successful payment from dropdown list methods  
2. The application user profile menu at top right corner shows 'Checkout' button when logged in correctly, ie the test case passes if it displays as expected   
3. User should not be able to proceed with check-out process without filling up all details (street address information , phone number)  or after making wrongly filled out data during payment step .  
4. Order confirmation mail from user side and system admin email id also confirming order is placed successfully in the platform as per requirement   
## References & Further Reading <a name = "refsAndFurtherReading"/> 
[Google Chrome](https://www.google.com/chrome/) , [Firefox browser] (http: // www .mozilla .org / firefox) – The browsers used for testing the application,  
Playwright Documentation - https ://playwright.dev/docs/.   
[Nigerian Zip code list](https://zippopotamus-api.vercel.app/) , [Phone validation RegExp] (http: //regexlib.com / REXML) .   – Regex patterns for phone number testing, and validating zipcode details respectively     
## Terminologies & Acronym Definitions <a name = "terminologyAcronym">   
1- Browser : Refers to the web browser which is being used in this scenario. (e.g Chrome or Firefox) –B  2 - Test Data: Used as input data for testing application’s behavior under specific conditions and requirements, can include email id & password combination , shipping address information etc.,
3- Precondition : A condition that has to be set before starting the test case execution (e.g user needs a logged in account).  4 - Assertion: Used as an expected outcome of testing process – B   5.- RegExp, Regex for phone number and zipcode validation tests etc.,
6- Test Case : A particular sequence or method to achieve required result(s), can be run multiple times.    7 . Steps (Numbered Listing with step description): Used as a set of instructions on how the test case should pass in order, e 8.- Email Validation RegExp and Phone Number Zipcode validation tests etc.,
9- Log out : End user activity after logging into platform/app.  10 - Test Environment: Platform where application is tested (e g dev environment).   
This markdown test plan will guide you through each steps of the checkout process for a logged in User using Playwright tool, ensuring it pass and fail as required according to your requirements or standard set by DevOps team.    
## Notes on Testing Methods  
Test cases are typically written manually first then automated if needed (Manual vs Automated). This test plan uses playwrigth script interface tools for automating the process of logging into user account, filling out order details and confirm placement via email confirmation link etc., ensuring testing is carried at a granular level.   
## Expected Behavioural Outcomes    
1 . The application should successfully place an Order with all required information (email , password).  2-. If filled up correctly then user will receive the ordered product or service from system admin via email confirmation link and also confirm order in platform as per requirement, ie passed if it appears at right places. 3- User needs to logout of account after successful check out process for cleanup activities only .   
## Steps For Further Modification/Extension  
1 - Adding new test cases based on product or service categories with specific user requirements (For instance adding different types and quantities, special requests etc.).    2. Updating existing functionality if required changes are made in the application's design like changing payment methods , add additional fields for address info such as city & state to accommodate more scenarios .   
