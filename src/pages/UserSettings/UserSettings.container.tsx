import { connect } from 'react-redux'
import UIActions from 'redux/reducers/ui'
import { errorsActions } from 'redux/reducers/errors'
import { authActions } from 'redux/reducers/auth'
import { alertsActions } from 'redux/reducers/alerts'
import { trackCustom } from 'utils/analytics'
import { StateType, AppDispatch } from 'redux/store'
import sagaActions from 'redux/sagas/actions'
import { IUser } from 'redux/models/IUser'
import { ISharedProject } from 'redux/models/ISharedProject'

import UserSettings from './UserSettings'

const mapStateToProps = (state: StateType) => {
  return {
    user: state.auth.user,
    dontRemember: state.auth.dontRemember,
    isPaidTierUsed: state.auth.isPaidTierUsed,
    // themeType: state.ui.theme.type,
  }
}

const mapDispatchToProps = (dispatch: AppDispatch) => ({
  onGDPRExportFailed: (message: string) => {
    dispatch(errorsActions.genericError({
      message,
    }))
  },
  onDelete: (t: (key: string) => string, onSuccess: {
    (): void,
  }) => {
    dispatch(
      sagaActions.deleteAccountAsync(
        (error: string) => dispatch(
          errorsActions.deleteAccountFailed({
            message: error,
          }),
        ),
        () => {
          trackCustom('ACCOUNT_DELETED')
          onSuccess()
        },
        t,
      ),
    )
  },
  updateUserData: (data: IUser) => {
    dispatch(authActions.updateUserData(data))
  },
  onDeleteProjectCache: () => {
    dispatch(UIActions.deleteProjectCache({}))
  },
  userSharedUpdate: (message: string) => {
    dispatch(alertsActions.userSharedUpdate({
      message,
    }))
  },
  sharedProjectError: (message: string) => {
    dispatch(errorsActions.sharedProjectFailed({
      message,
    }))
  },
  genericError: (message: string) => {
    dispatch(errorsActions.genericError({
      message,
    }))
  },
  removeProject: (projectId: string) => {
    dispatch(UIActions.removeProject({
      pid: projectId,
      shared: true,
    }))
  },
  removeShareProject: (id: string) => {
    dispatch(authActions.deleteShareProject(id))
  },
  setProjectsShareData: (data: Partial<ISharedProject>, id: string) => {
    dispatch(UIActions.setProjectsShareData({
      data,
      id,
      shared: true,
    }))
  },
  setUserShareData: (data: Partial<ISharedProject>, id: string) => {
    dispatch(authActions.setUserShareData({
      data,
      id,
    }))
  },
  updateProfileFailed: (message: string) => {
    dispatch(errorsActions.updateUserProfileFailed({
      message,
    }))
  },
  accountUpdated: (message: string) => {
    dispatch(alertsActions.accountUpdated({
      message,
    }))
  },
  updateUserProfileAsync: (data: Partial<IUser>, successMessage: string, callback = (e: any) => {}) => {
    dispatch(
      sagaActions.updateUserProfileAsync(
        data,
        (res: any) => {
          if (res) {
            dispatch(
              alertsActions.accountUpdated({
                message: successMessage,
              }),
            )
          }
          callback(res)
        },
      ),
    )
  },
  setAPIKey: (apiKey: string) => {
    dispatch(authActions.setApiKey(apiKey))
  },
  // setThemeType: (theme) => {
  //   dispatch(UIActions.setThemeType(theme))
  // },
})

export default connect(mapStateToProps, mapDispatchToProps)(UserSettings)