# Checkout Flow for Logged-In User - SaaS Web App

## Preconditions
1. The user account has been set up and the user is logged into the web application.
2. There are items in the shopping cart that can be checked out.
3. The user's billing information has been verified and saved to their account.
4. Ensure all features of the web app work correctly as expected, including navigation, form completion, error messages, etc.

## Test Data
1. User Name: "John Doe"
2. Email: johndoe@example.com
3. Shipping Address: 123 Main St, Anytown, USA
4. Credit Card Number: 1234-5678-9012-0000 (a valid test credit card number)
5. Expiry Date: Future date
6. CVV: 123
7. Billing ZIP code: 90210

## Steps
1. Login to the web app using the user credentials provided in the Test Data section.
2. Navigate to the shopping cart and confirm that there are items present.
3. Proceed to checkout from the shopping cart page.
4. Fill out all required information such as billing address, credit card details, etc.
5. Review the order summary before finalizing the purchase.
6. Click on "Place Order" button.
7. Confirm successful transaction and receipt of a confirmation email.
8. Logout from the web app.

## Assertions
1. The user is successfully logged into their account after providing valid credentials.
2. There are items in the shopping cart which can be checked out.
3. Successful redirection to the checkout page upon clicking on "Checkout" button on the Shopping Cart Page.
4. The Checkout form displays correctly and all fields are editable.
5. After entering billing details, an overview of the selected items for purchase appears with correct pricing information.
6. Clicking "Place Order" successfully completes the transaction and displays a confirmation message.
7. A confirmation email is received confirming successful purchase.
8. The user account successfully logs out after clicking on the logout button. 
9. No errors or exceptions occur during checkout process. 
10. After completing the order, the shopping cart becomes empty and no items are displayed in it. 
11. Navigating to different pages displays correct content without any broken links or missing elements.
