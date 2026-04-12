import asyncio
from playwright import async_api
from playwright.async_api import expect

async def run_test():
    pw = None
    browser = None
    context = None

    try:
        # Start a Playwright session in asynchronous mode
        pw = await async_api.async_playwright().start()

        # Launch a Chromium browser in headless mode with custom arguments
        browser = await pw.chromium.launch(
            headless=True,
            args=[
                "--window-size=1280,720",         # Set the browser window size
                "--disable-dev-shm-usage",        # Avoid using /dev/shm which can cause issues in containers
                "--ipc=host",                     # Use host-level IPC for better stability
                "--single-process"                # Run the browser in a single process mode
            ],
        )

        # Create a new browser context (like an incognito window)
        context = await browser.new_context()
        context.set_default_timeout(5000)

        # Open a new page in the browser context
        page = await context.new_page()

        # Interact with the page elements to simulate user flow
        # -> Navigate to http://localhost:3001
        await page.goto("http://localhost:3001")
        
        # -> Open the registration/login flow by clicking the 'Giriş Yap' button.
        frame = context.pages[-1]
        # Click element
        elem = frame.locator('xpath=/html/body/div[2]/header/div/div/button[2]').nth(0)
        await asyncio.sleep(3); await elem.click()
        
        # -> Click the 'Hesabınız yok mu? Kayıt olun' button to open the registration form.
        frame = context.pages[-1]
        # Click element
        elem = frame.locator('xpath=/html/body/div[2]/div/div/form/div[2]/button').nth(0)
        await asyncio.sleep(3); await elem.click()
        
        # -> Fill the registration form with a unique username and email and a valid password, then submit the form.
        frame = context.pages[-1]
        # Input text
        elem = frame.locator('xpath=/html/body/div[2]/div/div/form/input').nth(0)
        await asyncio.sleep(3); await elem.fill('testuser4567')
        
        frame = context.pages[-1]
        # Input text
        elem = frame.locator('xpath=/html/body/div[2]/div/div/form/input[2]').nth(0)
        await asyncio.sleep(3); await elem.fill('testuser4567+20260412@example.com')
        
        frame = context.pages[-1]
        # Input text
        elem = frame.locator('xpath=/html/body/div[2]/div/div/form/input[3]').nth(0)
        await asyncio.sleep(3); await elem.fill('test11')
        
        # -> Click the 'Kayıt Ol' (Register) submit button to create the account and proceed.
        frame = context.pages[-1]
        # Click element
        elem = frame.locator('xpath=/html/body/div[2]/div/div/form/div/button[2]').nth(0)
        await asyncio.sleep(3); await elem.click()
        
        # -> Start the first unlocked level by clicking its 'Başla →' button.
        frame = context.pages[-1]
        # Click element
        elem = frame.locator('xpath=/html/body/div[2]/main/div[2]/a/div[2]/button').nth(0)
        await asyncio.sleep(3); await elem.click()
        
        # -> Select the correct answer for question 1 ('Hello') and submit by clicking 'Kontrol Et'.
        frame = context.pages[-1]
        # Click element
        elem = frame.locator('xpath=/html/body/div[2]/main/div/div[2]/button').nth(0)
        await asyncio.sleep(3); await elem.click()
        
        frame = context.pages[-1]
        # Click element
        elem = frame.locator('xpath=/html/body/div[2]/button').nth(0)
        await asyncio.sleep(3); await elem.click()
        
        # -> Click the 'Kontrol Et' button to submit the selected answer for question 1 and observe feedback.
        frame = context.pages[-1]
        # Click element
        elem = frame.locator('xpath=/html/body/div[2]/main/div/div[3]/button').nth(0)
        await asyncio.sleep(3); await elem.click()
        
        # -> Click the 'Sonraki Soru →' button to advance to Question 2 and then answer it.
        frame = context.pages[-1]
        # Click element
        elem = frame.locator('xpath=/html/body/div[2]/button').nth(0)
        await asyncio.sleep(3); await elem.click()
        
        # -> Click the correct answer for Question 2 ('Thank you') by selecting the option button (index 962), then wait for the UI to update so the 'Kontrol Et' button becomes available.
        frame = context.pages[-1]
        # Click element
        elem = frame.locator('xpath=/html/body/div[2]/main/div/div[2]/button[2]').nth(0)
        await asyncio.sleep(3); await elem.click()
        
        # -> Click the 'Kontrol Et' button to submit the selected answer for Question 2 and observe the feedback.
        frame = context.pages[-1]
        # Click element
        elem = frame.locator('xpath=/html/body/div[2]/main/div/div[3]/button').nth(0)
        await asyncio.sleep(3); await elem.click()
        
        # -> Click the 'Sonraki Soru →' button to advance to Question 3 and continue answering the remaining questions.
        frame = context.pages[-1]
        # Click element
        elem = frame.locator('xpath=/html/body/div[2]/main/div/div[3]/button').nth(0)
        await asyncio.sleep(3); await elem.click()
        
        # -> Enter the correct answer for Question 3 into the text input and click 'Kontrol Et' to submit it.
        frame = context.pages[-1]
        # Input text
        elem = frame.locator('xpath=/html/body/div[2]/main/div/div[2]/input').nth(0)
        await asyncio.sleep(3); await elem.fill('morning')
        
        frame = context.pages[-1]
        # Click element
        elem = frame.locator('xpath=/html/body/div[2]/button').nth(0)
        await asyncio.sleep(3); await elem.click()
        
        # -> Submit the Q3 answer by clicking the 'Kontrol Et' button.
        frame = context.pages[-1]
        # Click element
        elem = frame.locator('xpath=/html/body/div[2]/main/div/div[3]/button').nth(0)
        await asyncio.sleep(3); await elem.click()
        
        # -> Advance to Question 4 by clicking the visible 'Sonraki Soru →' button, then inspect and answer Q4.
        frame = context.pages[-1]
        # Click element
        elem = frame.locator('xpath=/html/body/div[2]/main/div/div[3]/button').nth(0)
        await asyncio.sleep(3); await elem.click()
        
        # -> Select the correct answer for Question 4 ('Goodbye') and submit it by clicking 'Kontrol Et'.
        frame = context.pages[-1]
        # Click element
        elem = frame.locator('xpath=/html/body/div[2]/main/div/div[2]/button[2]').nth(0)
        await asyncio.sleep(3); await elem.click()
        
        frame = context.pages[-1]
        # Click element
        elem = frame.locator('xpath=/html/body/div[2]/button').nth(0)
        await asyncio.sleep(3); await elem.click()
        
        # -> Click the 'Kontrol Et' button to submit the selected answer for Question 4 and observe the feedback.
        frame = context.pages[-1]
        # Click element
        elem = frame.locator('xpath=/html/body/div[2]/main/div/div[3]/button').nth(0)
        await asyncio.sleep(3); await elem.click()
        
        # -> Advance to the next question (click 'Sonraki Soru →') so I can answer Question 5.
        frame = context.pages[-1]
        # Click element
        elem = frame.locator('xpath=/html/body/div[2]/main/div/div[3]/button').nth(0)
        await asyncio.sleep(3); await elem.click()
        
        # -> Submit the answer for Question 5 by entering the correct word into the input and clicking 'Kontrol Et', then return to the level list (reload homepage) to verify the next level is unlocked.
        frame = context.pages[-1]
        # Input text
        elem = frame.locator('xpath=/html/body/div[2]/main/div/div[2]/input').nth(0)
        await asyncio.sleep(3); await elem.fill('you')
        
        frame = context.pages[-1]
        # Click element
        elem = frame.locator('xpath=/html/body/div[2]/button').nth(0)
        await asyncio.sleep(3); await elem.click()
        
        await page.goto("http://localhost:3001")
        
        # --> Assertions to verify final state
        frame = context.pages[-1]
        assert await frame.locator("xpath=//*[contains(., 'Seviye tamamlandı')]").nth(0).is_visible(), "The learner should see a level completion confirmation after finishing all questions",
        assert await frame.locator("xpath=//*[contains(., 'Başla →')]").nth(0).is_visible(), "The next level should be shown as unlocked on the level list after reloading the page"
        await asyncio.sleep(5)

    finally:
        if context:
            await context.close()
        if browser:
            await browser.close()
        if pw:
            await pw.stop()

asyncio.run(run_test())
    