import { types } from './types'

const loadProjects = (take, skip) => ({
  type: types.LOAD_PROJECTS,
  payload: { take, skip },
})

const loadSharedProjects = (take, skip) => ({
  type: types.LOAD_SHARED_PROJECTS,
  payload: { take, skip },
})

const setProjects = (projects) => ({
  type: types.SET_PROJECTS,
  payload: {
    projects,
  },
})

const setTotalMonthlyEvents = (totalMonthlyEvents) => ({
  type: types.SET_TOTAL_MONTHLY_EVENTS,
  payload: {
    totalMonthlyEvents,
  },
})

const setTotal = (total) => ({
  type: types.SET_TOTAL,
  payload: {
    total,
  },
})

const setDashboardPaginationPage = (page) => ({
  type: types.SET_DASHBOARD_PAGINATION_PAGE,
  payload: {
    page,
  },
})

const setShowNoEventsLeftBanner = (showNoEventsLeftBanner) => ({
  type: types.SET_SHOW_NO_EVENTS_LEFT,
  payload: {
    showNoEventsLeftBanner,
  },
})

const setLiveStats = (data) => ({
  type: types.SET_LIVE_STATS,
  payload: {
    data,
  },
})

const setLiveStatsForProject = (id, count) => ({
  type: types.SET_LIVE_STATS_PROJECT,
  payload: {
    id, count,
  },
})

const setPublicProject = (project) => ({
  type: types.SET_PUBLIC_PROJECT,
  payload: {
    project,
  },
})

const removeProject = (pid) => ({
  type: types.REMOVE_PROJECT,
  payload: {
    pid,
  },
})

const setProjectsError = (error) => ({
  type: types.SET_PROJECTS_ERROR,
  payload: {
    error,
  },
})

const setProjectsLoading = (isLoading) => ({
  type: types.SET_PROJECTS_LOADING,
  payload: {
    isLoading,
  },
})

const setProjectCache = (pid, data, key) => ({
  type: types.SET_PROJECT_CACHE,
  payload: {
    pid, data, key,
  },
})

const deleteProjectCache = (pid, period, timeBucket) => ({
  type: types.DELETE_PROJECT_CACHE,
  payload: {
    pid, period, timeBucket,
  },
})

const setProjectViewPrefs = (pid, period, timeBucket, rangeDate) => ({
  type: types.SET_PROJECT_VIEW_PREFS,
  payload: {
    pid, period, timeBucket, rangeDate,
  },
})

const setTheme = (theme) => ({
  type: types.SET_THEME,
  payload: {
    theme,
  },
})

const setGeneralStats = (stats) => ({
  type: types.SET_GENERAL_STATS,
  payload: {
    stats,
  },
})

const setPaddleLastEvent = (event) => ({
  type: types.SET_PADDLE_LAST_EVENT,
  payload: {
    event,
  },
})

const setProjectsShareData = (data, id) => ({
  type: types.SET_PROJECTS_SHARE_DATA,
  payload: {
    data,
    id,
  },
})

const shareVerifyAsync = (data, successfulCallback, errorCallback) => ({
  type: types.SHARE_VERIFY_ASYNC,
  payload: { data, successfulCallback, errorCallback },
})

const UIActions = {
  loadProjects,
  loadSharedProjects,
  setProjects,
  setProjectsError,
  setProjectsLoading,
  removeProject,
  setProjectCache,
  deleteProjectCache,
  setProjectViewPrefs,
  setPublicProject,
  setLiveStatsForProject,
  setLiveStats,
  setTheme,
  setGeneralStats,
  setPaddleLastEvent,
  setTotalMonthlyEvents,
  setDashboardPaginationPage,
  setTotal,
  setShowNoEventsLeftBanner,
  setProjectsShareData,
  shareVerifyAsync,
}

export default UIActions
