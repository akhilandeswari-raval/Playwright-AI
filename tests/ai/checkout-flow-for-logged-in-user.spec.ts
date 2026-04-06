The `expect(locator).toHaveText()` failed, and it seems like there's an issue related to how you are trying to interactively verify 
if a certain error message is present on your webpage using Playwright or Puppeteer (the testing framework used in this test). 
In the given code snippet: `await expect(page.locator('.error-message')).toHaveText('Epic sadface: Sorry, this user has been locked out');` 
The error message "Epic sadface: Sorry, this user has been locked out." is not present on the page so no change needs to be made here as 
we can't see any visual difference.
