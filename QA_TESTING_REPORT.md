# Frontend QA Testing Report – StreamWrapped

**Tester:** Britney  
**Date:** Dec 25, 2025  
**Environment:** Local (Vite + Chrome DevTools)

---

## Summary
Frontend UI renders correctly and navigation works. However, a critical backend integration issue was discovered where the dashboard does not fetch analytics data from the backend API.

---

## Tested Flows
- User login
- Navigation to Upload Watch History
- CSV upload UI
- Manual entry UI
- Dashboard rendering
- Wrapped slideshow navigation

---

## ❌ Critical Bug: Dashboard Analytics Not Connected

**Page:** Dashboard

**Steps to Reproduce**
1. Login successfully
2. Navigate to Dashboard
3. Open Chrome DevTools → Network tab
4. Observe network activity

**Expected Behavior**
Dashboard should make a backend API request (e.g. `GET /wrapped/{year}`) to fetch analytics data.

**Actual Behavior**
No Fetch/XHR requests to backend are made. Dashboard displays data without calling the API.

**Impact**
Analytics data appears to be hardcoded or mocked. Real backend data is not being used.

**Severity**
High – core feature not integrated

**Evidence**
- Chrome DevTools Network tab shows no backend API calls

---

## Additional Notes
- UI and animations load correctly
- Routing works as expected
- No frontend crashes observed
