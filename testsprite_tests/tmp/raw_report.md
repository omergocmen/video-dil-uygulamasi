
# TestSprite AI Testing Report(MCP)

---

## 1️⃣ Document Metadata
- **Project Name:** video-dil-ornegi
- **Date:** 2026-04-12
- **Prepared by:** TestSprite AI Team

---

## 2️⃣ Requirement Validation Summary

#### Test TC001 Complete a level and unlock the next level
- **Test Code:** [TC001_Complete_a_level_and_unlock_the_next_level.py](./TC001_Complete_a_level_and_unlock_the_next_level.py)
- **Test Error:** TEST FAILURE

Completing the first level did not unlock the next level after reloading the level list.

Observations:
- The page did not show a level completion confirmation after submitting the final answer.
- After returning to the homepage, the second level ('Günlük Kelimeler') remained visually locked.
- **Test Visualization and Result:** https://www.testsprite.com/dashboard/mcp/tests/74bccdb6-7ae7-43e2-9b79-c06c0dd812ad/9567c31a-2179-4f49-b250-72ddedaad651
- **Status:** ❌ Failed
- **Analysis / Findings:** {{TODO:AI_ANALYSIS}}.
---

#### Test TC002 Log in and see learning progress with available levels
- **Test Code:** [TC002_Log_in_and_see_learning_progress_with_available_levels.py](./TC002_Log_in_and_see_learning_progress_with_available_levels.py)
- **Test Visualization and Result:** https://www.testsprite.com/dashboard/mcp/tests/74bccdb6-7ae7-43e2-9b79-c06c0dd812ad/e239f15a-44f4-4e33-82c1-edc8d2afff78
- **Status:** ✅ Passed
- **Analysis / Findings:** {{TODO:AI_ANALYSIS}}.
---

#### Test TC003 Register new user and land in logged-in state
- **Test Code:** [TC003_Register_new_user_and_land_in_logged_in_state.py](./TC003_Register_new_user_and_land_in_logged_in_state.py)
- **Test Visualization and Result:** https://www.testsprite.com/dashboard/mcp/tests/74bccdb6-7ae7-43e2-9b79-c06c0dd812ad/0c8cc647-fdc0-440d-8676-17d3a2f44479
- **Status:** ✅ Passed
- **Analysis / Findings:** {{TODO:AI_ANALYSIS}}.
---

#### Test TC004 Browse levels and start an unlocked level
- **Test Code:** [TC004_Browse_levels_and_start_an_unlocked_level.py](./TC004_Browse_levels_and_start_an_unlocked_level.py)
- **Test Visualization and Result:** https://www.testsprite.com/dashboard/mcp/tests/74bccdb6-7ae7-43e2-9b79-c06c0dd812ad/264c2273-42d6-4faf-976a-4bbc0918e700
- **Status:** ✅ Passed
- **Analysis / Findings:** {{TODO:AI_ANALYSIS}}.
---

#### Test TC005 Resume progress as a returning learner and continue to the next unlocked level
- **Test Code:** [TC005_Resume_progress_as_a_returning_learner_and_continue_to_the_next_unlocked_level.py](./TC005_Resume_progress_as_a_returning_learner_and_continue_to_the_next_unlocked_level.py)
- **Test Visualization and Result:** https://www.testsprite.com/dashboard/mcp/tests/74bccdb6-7ae7-43e2-9b79-c06c0dd812ad/e50cbf6e-0279-4a7f-a006-e13be1039332
- **Status:** ✅ Passed
- **Analysis / Findings:** {{TODO:AI_ANALYSIS}}.
---

#### Test TC006 Validate empty answer submission within a level
- **Test Code:** [TC006_Validate_empty_answer_submission_within_a_level.py](./TC006_Validate_empty_answer_submission_within_a_level.py)
- **Test Error:** TEST FAILURE

Submitting an empty answer did not show a validation message and the UI allowed the submission without prompting the user to select an answer.

Observations:
- Clicking 'Kontrol Et' without selecting an option produced no visible validation or error.
- The page remained on the same question and no inline or toast validation text was found when searching for common Turkish/English phrases.
- The LingoAssistant chat was closed to ensure it was not obscuring any feedback, but no validation appeared.

- **Test Visualization and Result:** https://www.testsprite.com/dashboard/mcp/tests/74bccdb6-7ae7-43e2-9b79-c06c0dd812ad/2df8d0c5-7801-4bd5-a017-2b0d1bbd8860
- **Status:** ❌ Failed
- **Analysis / Findings:** {{TODO:AI_ANALYSIS}}.
---

#### Test TC007 Get help from AI Tutor while in a level
- **Test Code:** [TC007_Get_help_from_AI_Tutor_while_in_a_level.py](./TC007_Get_help_from_AI_Tutor_while_in_a_level.py)
- **Test Visualization and Result:** https://www.testsprite.com/dashboard/mcp/tests/74bccdb6-7ae7-43e2-9b79-c06c0dd812ad/32aad0b9-b588-4102-a9ce-8d035ce31e5b
- **Status:** ✅ Passed
- **Analysis / Findings:** {{TODO:AI_ANALYSIS}}.
---

#### Test TC008 Answer multiple choice and fill-in-the-blank questions with feedback
- **Test Code:** [TC008_Answer_multiple_choice_and_fill_in_the_blank_questions_with_feedback.py](./TC008_Answer_multiple_choice_and_fill_in_the_blank_questions_with_feedback.py)
- **Test Visualization and Result:** https://www.testsprite.com/dashboard/mcp/tests/74bccdb6-7ae7-43e2-9b79-c06c0dd812ad/74606c29-9e0c-4a87-99a2-b2dbf73b04b1
- **Status:** ✅ Passed
- **Analysis / Findings:** {{TODO:AI_ANALYSIS}}.
---

#### Test TC009 Advance to the next question after submitting an answer
- **Test Code:** [TC009_Advance_to_the_next_question_after_submitting_an_answer.py](./TC009_Advance_to_the_next_question_after_submitting_an_answer.py)
- **Test Visualization and Result:** https://www.testsprite.com/dashboard/mcp/tests/74bccdb6-7ae7-43e2-9b79-c06c0dd812ad/e62df518-b131-4ada-8917-a81a8819d087
- **Status:** ✅ Passed
- **Analysis / Findings:** {{TODO:AI_ANALYSIS}}.
---

#### Test TC010 Create a new level in the admin panel
- **Test Code:** [TC010_Create_a_new_level_in_the_admin_panel.py](./TC010_Create_a_new_level_in_the_admin_panel.py)
- **Test Visualization and Result:** https://www.testsprite.com/dashboard/mcp/tests/74bccdb6-7ae7-43e2-9b79-c06c0dd812ad/f0362be7-6156-4b0a-b915-19bf37762a06
- **Status:** ✅ Passed
- **Analysis / Findings:** {{TODO:AI_ANALYSIS}}.
---

#### Test TC011 Add multiple question types to a level in admin
- **Test Code:** [TC011_Add_multiple_question_types_to_a_level_in_admin.py](./TC011_Add_multiple_question_types_to_a_level_in_admin.py)
- **Test Visualization and Result:** https://www.testsprite.com/dashboard/mcp/tests/74bccdb6-7ae7-43e2-9b79-c06c0dd812ad/171307ed-903b-471b-82a9-391445288580
- **Status:** ✅ Passed
- **Analysis / Findings:** {{TODO:AI_ANALYSIS}}.
---

#### Test TC012 Prevent starting a locked level from the level list
- **Test Code:** [TC012_Prevent_starting_a_locked_level_from_the_level_list.py](./TC012_Prevent_starting_a_locked_level_from_the_level_list.py)
- **Test Visualization and Result:** https://www.testsprite.com/dashboard/mcp/tests/74bccdb6-7ae7-43e2-9b79-c06c0dd812ad/bce16391-21f9-4c19-bdce-3042685cf70c
- **Status:** ✅ Passed
- **Analysis / Findings:** {{TODO:AI_ANALYSIS}}.
---

#### Test TC013 Delete a question from a level in admin with confirmation
- **Test Code:** [TC013_Delete_a_question_from_a_level_in_admin_with_confirmation.py](./TC013_Delete_a_question_from_a_level_in_admin_with_confirmation.py)
- **Test Error:** TEST BLOCKED

The admin UI could not be inspected to verify the deletion because the page is empty or not rendering.

Observations:
- The page currently has an empty DOM and shows 0 interactive elements.
- Many browser confirmation dialogs ('Bu soruyu silmek istediğinize emin misiniz?') were auto-closed while attempting deletion, but the UI never returned to a state where the question list could be checked.
- **Test Visualization and Result:** https://www.testsprite.com/dashboard/mcp/tests/74bccdb6-7ae7-43e2-9b79-c06c0dd812ad/5db7badc-dbed-4932-93b0-4ed669f21000
- **Status:** BLOCKED
- **Analysis / Findings:** {{TODO:AI_ANALYSIS}}.
---

#### Test TC014 Validate email format during registration
- **Test Code:** [TC014_Validate_email_format_during_registration.py](./TC014_Validate_email_format_during_registration.py)
- **Test Visualization and Result:** https://www.testsprite.com/dashboard/mcp/tests/74bccdb6-7ae7-43e2-9b79-c06c0dd812ad/1b00d918-e4e0-4ef3-8325-9a0f6b88ee36
- **Status:** ✅ Passed
- **Analysis / Findings:** {{TODO:AI_ANALYSIS}}.
---

#### Test TC015 Reject login with incorrect credentials
- **Test Code:** [TC015_Reject_login_with_incorrect_credentials.py](./TC015_Reject_login_with_incorrect_credentials.py)
- **Test Visualization and Result:** https://www.testsprite.com/dashboard/mcp/tests/74bccdb6-7ae7-43e2-9b79-c06c0dd812ad/d81a78d3-e278-467b-ab8f-14b96a50a4f4
- **Status:** ✅ Passed
- **Analysis / Findings:** {{TODO:AI_ANALYSIS}}.
---


## 3️⃣ Coverage & Matching Metrics

- **80.00** of tests passed

| Requirement        | Total Tests | ✅ Passed | ❌ Failed  |
|--------------------|-------------|-----------|------------|
| ...                | ...         | ...       | ...        |
---


## 4️⃣ Key Gaps / Risks
{AI_GNERATED_KET_GAPS_AND_RISKS}
---