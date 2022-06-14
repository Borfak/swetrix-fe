import React, { useState, useEffect, useRef } from 'react'
import { ChevronDownIcon, CheckIcon } from '@heroicons/react/solid'
import { TrashIcon } from '@heroicons/react/outline'
import { useTranslation } from 'react-i18next'
import cx from 'clsx'
import PropTypes from 'prop-types'
import _keys from 'lodash/keys'
import _isEmpty from 'lodash/isEmpty'
import _filter from 'lodash/filter'
import _map from 'lodash/map'

import { deleteShareProjectUsers, shareProject, changeShareRole } from 'api'
import { isValidEmail } from 'utils/validator'
import Input from 'ui/Input'
import { WarningPin } from 'ui/Pin'
import Button from 'ui/Button'
import Beta from 'ui/Beta'
import Modal from 'ui/Modal'
import {
  roles, roleViewer, roleAdmin, INVITATION_EXPIRES_IN,
} from 'redux/constants'
import useOnClickOutside from 'hooks/useOnClickOutside'

const NoEvents = ({ t }) => (
  <div className='flex flex-col py-6 sm:px-6 lg:px-8'>
    <div className='max-w-7xl w-full mx-auto text-gray-900 dark:text-gray-50'>
      <h2 className='text-2xl mb-8 text-center leading-snug'>
        {t('project.settings.noPeople')}
      </h2>
    </div>
  </div>
)

const UsersList = ({ data, onRemove, t }) => {
  const [open, setOpen] = useState(false)
  const [showDeleteModal, setShowDeleteModal] = useState(false)
  const openRef = useRef()
  useOnClickOutside(openRef, () => setOpen(false))

  const changeRole = async (role) => {
    await changeShareRole(data.id, { role })
      .then((results) => {
        console.log(results)
        setOpen(false)
      })
      .catch((e) => {
        console.log(e)
        setOpen(false)
      })
  }

  return (
    <li className='py-4'>
      <div className='flex justify-between'>
        <p className='text-gray-700 dark:text-gray-200'>
          {data.user.email}
        </p>
        <div className={cx('relative', { 'flex items-center': !data.confirmed })}>
          {
            !data.confirmed ? (
              <>
                <WarningPin
                  label={t('common.pending')}
                  className='inline-flex items-center shadow-sm px-2.5 py-0.5 mr-3'
                />
                <Button
                  type='button'
                  className='bg-white text-indigo-600 border border-transparent rounded-md text-base font-medium hover:bg-indigo-50 dark:text-gray-50 dark:border-gray-800 dark:bg-gray-700 dark:hover:bg-gray-600'
                  small
                  onClick={() => { setShowDeleteModal(true) }}
                >
                  <TrashIcon className='h-4 w-4' />
                </Button>
              </>
            ) : (
              <>
                <button
                  onClick={() => { setOpen(!open) }}
                  type='button'
                  className='inline-flex items-center shadow-sm pl-2 pr-1 py-0.5 border border-gray-200 dark:border-gray-500 text-sm leading-5 font-medium rounded-full bg-white dark:bg-gray-700 text-gray-700 dark:text-gray-200 hover:bg-gray-50 dark:hover:bg-gray-800'
                >
                  {t(`project.settings.roles.${data.role}.name`)}
                  <ChevronDownIcon
                    style={{ transform: open ? 'rotate(180deg)' : '' }}
                    className='w-4 h-4 pt-px ml-0.5'
                  />
                </button>
                {open && (
                  <ul ref={openRef} className='origin-top-right absolute z-10 right-0 mt-2 w-72 rounded-md shadow-lg overflow-hidden bg-white dark:bg-gray-800 divide-y divide-gray-200 dark:divide-gray-700 focus:outline-none'>
                    {_map(roles, (role) => (
                      <li onClick={() => changeRole(role)} className='p-4 hover:bg-indigo-600 group cursor-pointer flex justify-between items-center' key={role}>
                        <div>
                          <p className='font-bold text-gray-700 dark:text-gray-200 group-hover:text-gray-200'>
                            {t(`project.settings.roles.${role}.name`)}
                          </p>
                          <p className='mt-1 text-sm text-gray-500 group-hover:text-gray-200'>
                            {t(`project.settings.roles.${role}.shortDesc`)}
                          </p>
                        </div>
                        {data.role === role && (
                          <span className='text-indigo-600 group-hover:text-gray-200'>
                            <CheckIcon className='w-7 h-7 pt-px ml-1' />
                          </span>
                        )}
                      </li>
                    ))}
                    <li onClick={() => { setOpen(false); setShowDeleteModal(true) }} className='p-4 hover:bg-gray-300 dark:hover:bg-gray-700 group cursor-pointer flex justify-between items-center'>
                      <div>
                        <p className='font-bold text-red-600 dark:text-red-500'>
                          {t('project.settings.removeMember')}
                        </p>
                      </div>
                    </li>
                  </ul>
                )}
              </>
            )
          }
        </div>
      </div>
      <Modal
        onClose={() => {
          setShowDeleteModal(false)
        }}
        onSubmit={() => {
          setShowDeleteModal(false)
          onRemove(data.id)
        }}
        submitText={t('common.yes')}
        type='confirmed'
        closeText={t('common.no')}
        title={t('project.settings.removeUser', { user: data.user?.email })}
        message={t('project.settings.removeConfirm')}
        isOpened={showDeleteModal}
      />
    </li>
  )
}

UsersList.propTypes = {
  // eslint-disable-next-line react/forbid-prop-types
  data: PropTypes.object.isRequired,
  onRemove: PropTypes.func,
}

UsersList.defaultProps = {
  onRemove: () => { },
}

const People = ({
  project, updateProjectFailed, setProjectShare,
}) => {
  const [showModal, setShowModal] = useState(false)
  const { t } = useTranslation('common')
  const [form, setForm] = useState({
    email: '',
    role: '',
  })
  const [beenSubmitted, setBeenSubmitted] = useState(false)
  const [errors, setErrors] = useState({})
  const [validated, setValidated] = useState(false)
  const { id, name, share } = project

  const validate = () => {
    const allErrors = {}

    if (!isValidEmail(form.email)) {
      allErrors.email = t('auth.common.badEmailError')
    }

    if (_isEmpty(form.role)) {
      allErrors.role = t('project.settings.errorNoRole')
    }

    const valid = _isEmpty(_keys(allErrors))

    setErrors(allErrors)
    setValidated(valid)
  }

  useEffect(() => {
    if (showModal) {
      validate()
    }
  }, [form]) // eslint-disable-line

  const handleInput = ({ target }) => {
    const value = target.type === 'checkbox' ? target.checked : target.value

    setForm(oldForm => ({
      ...oldForm,
      [target.name]: value,
    }))
  }

  const onSubmit = () => {
    setShowModal(false)
    setErrors({})
    setValidated(false)
    // a timeout is needed to prevent the flicker of data fields in the modal when closing
    setTimeout(() => setForm({ email: '', role: '' }), 300)
    shareProject(id, { email: form.email, role: form.role })
      .then((results) => {
        setProjectShare(results.share, id)
      })
      .catch((e) => {
        updateProjectFailed(e)
      })
  }

  const handleSubmit = e => {
    e.preventDefault()
    e.stopPropagation()
    setBeenSubmitted(true)
    if (validated) {
      onSubmit()
    } else {
      validate()
    }
  }

  const closeModal = () => {
    setShowModal(false)
    // a timeout is needed to prevent the flicker of data fields in the modal when closing
    setTimeout(() => setForm({ email: '', role: '' }), 300)
    setErrors({})
  }

  const onRemove = userId => {
    deleteShareProjectUsers(id, userId)
      .then(() => {
        const newShared = _map(_filter(share, s => s.id !== userId), s => s)
        setProjectShare(newShared, id)
      })
      .catch((e) => {
        updateProjectFailed(e)
      })
  }

  return (
    <div className='mt-6 mb-6'>
      <div className='flex justify-between items-center mb-3'>
        <div>
          <h3 className='flex items-center mt-2 text-lg font-bold text-gray-900 dark:text-gray-50'>
            {t('project.settings.people')}
            <Beta className='ml-10' />
          </h3>
          <p className='text-sm text-gray-500 dark:text-gray-400'>
            {t('project.settings.inviteCoworkers')}
          </p>
        </div>
        <Button
          className='h-8'
          primary
          regular
          type='button'
          onClick={() => setShowModal(true)}
        >
          {t('project.settings.invite')}
        </Button>
      </div>
      <div>
        {
          _isEmpty(share) ? (
            <NoEvents t={t} />
          ) : (
            <ul className='divide-y divide-gray-200 dark:divide-gray-700'>
              {_map(share, user => (<UsersList data={user} key={user.id} onRemove={onRemove} t={t} />))}
            </ul>
          )
        }
      </div>
      <Modal
        onClose={closeModal}
        onSubmit={handleSubmit}
        submitText={t('common.invite')}
        closeText={t('common.cancel')}
        message={(
          <div>
            <h2 className='text-xl font-bold text-gray-700 dark:text-gray-200'>
              {t('project.settings.inviteTo', { project: name })}
            </h2>
            <p className='mt-2 text-base text-gray-700 dark:text-gray-200'>
              {t('project.settings.inviteDesc')}
            </p>
            <p className='mt-2 text-base text-gray-700 dark:text-gray-200'>
              {t('project.settings.inviteExpity', { amount: INVITATION_EXPIRES_IN })}
            </p>
            <Input
              name='email'
              id='email'
              type='email'
              label={t('auth.common.email')}
              value={form.email}
              placeholder='you@example.com'
              className='mt-4'
              onChange={handleInput}
              error={beenSubmitted && errors.email}
            />
            <fieldset className='mt-4'>
              {/* eslint-disable-next-line jsx-a11y/label-has-associated-control */}
              <label className='block text-sm font-medium text-gray-700 dark:text-gray-300' htmlFor='role'>
                {t('project.settings.role')}
              </label>
              <div className={cx('mt-1 bg-white rounded-md -space-y-px dark:bg-gray-800', { 'border-red-300 border': errors.role })}>
                {/* eslint-disable-next-line jsx-a11y/label-has-associated-control */}
                <label className={cx('dark:border-gray-500 rounded-tl-md rounded-tr-md relative border p-4 flex cursor-pointer border-gray-200', { 'bg-indigo-50 border-indigo-200 dark:bg-indigo-500 dark:border-indigo-800 z-10': form.role === roleAdmin.role, 'border-gray-200': form.role !== roleAdmin.role })}>
                  <input
                    name='role'
                    className='focus:ring-indigo-500 h-4 w-4 text-indigo-600 border-gray-300'
                    id='role_admin'
                    type='radio'
                    value='admin'
                    onChange={handleInput}
                  />
                  <div className='ml-3 flex flex-col'>
                    <span className={cx('block text-sm font-medium', { 'text-indigo-900 dark:text-white': form.role === roleAdmin.role, 'text-gray-700 dark:text-gray-200': form.role !== roleAdmin.role })}>
                      {t('project.settings.roles.admin.name')}
                    </span>
                    <span className={cx('block text-sm', { 'text-indigo-700 dark:text-gray-100': form.role === roleAdmin.role, 'text-gray-700 dark:text-gray-200': form.role !== roleAdmin.role })}>
                      {t('project.settings.roles.admin.desc')}
                    </span>
                  </div>
                </label>
                {/* eslint-disable-next-line jsx-a11y/label-has-associated-control */}
                <label className={cx('dark:border-gray-500 rounded-bl-md rounded-br-md relative border p-4 flex cursor-pointer border-gray-200', { 'bg-indigo-50 border-indigo-200 dark:bg-indigo-500 dark:border-indigo-800 z-10': form.role === roleViewer.role, 'border-gray-200': form.role !== roleViewer.role })}>
                  <input
                    name='role'
                    className='focus:ring-indigo-500 h-4 w-4 text-indigo-600 border-gray-300'
                    id='role_viewer'
                    type='radio'
                    value='viewer'
                    onChange={handleInput}
                  />
                  <div className='ml-3 flex flex-col'>
                    <span className={cx('block text-sm font-medium', { 'text-indigo-900 dark:text-white': form.role === roleViewer.role, 'text-gray-700 dark:text-gray-200': form.role !== roleViewer.role })}>
                      {t('project.settings.roles.viewer.name')}
                    </span>
                    <span className={cx('block text-sm', { 'text-indigo-700 dark:text-gray-100': form.role === roleViewer.role, 'text-gray-700 dark:text-gray-200': form.role !== roleViewer.role })}>
                      {t('project.settings.roles.viewer.desc')}
                    </span>
                  </div>
                </label>
              </div>
              {errors.role && (
                <p className='mt-2 text-sm text-red-600 dark:text-red-500' id='email-error'>{errors.role}</p>
              )}
            </fieldset>
          </div>
        )}
        isOpened={showModal}
      />
    </div>
  )
}

People.propTypes = {
  // eslint-disable-next-line react/forbid-prop-types
  project: PropTypes.object.isRequired,
  updateProjectFailed: PropTypes.func,
  setProjectShare: PropTypes.func,
}

People.defaultProps = {
  updateProjectFailed: () => { },
  setProjectShare: () => { },
}

export default People
