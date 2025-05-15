import React, { useState } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import {
  CButton,
  CCard,
  CCardBody,
  CCardGroup,
  CCol,
  CContainer,
  CForm,
  CFormInput,
  CRow,
  CAlert,
  CFormText,
} from '@coreui/react'
import axios from 'axios'

const ResetPassword = () => {
  const [newPassword, setNewPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')
  const [newPasswordError, setNewPasswordError] = useState('')
  const [confirmPasswordError, setConfirmPasswordError] = useState('')
  const [globalError, setGlobalError] = useState('')
  const [success, setSuccess] = useState('')
  const { token } = useParams()
  const navigate = useNavigate()

  const validatePassword = (password) => {
    const regex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d).{8,}$/
    return regex.test(password)
  }

  const handleNewPasswordChange = (e) => {
    const value = e.target.value
    setNewPassword(value)

    if (!validatePassword(value)) {
      setNewPasswordError(
        'Le mot de passe doit contenir au moins 8 caractères, une majuscule, une minuscule et un chiffre',
      )
    } else {
      setNewPasswordError('')
    }

    if (confirmPassword && value !== confirmPassword) {
      setConfirmPasswordError('Les mots de passe ne correspondent pas')
    } else {
      setConfirmPasswordError('')
    }
  }

  const handleConfirmPasswordChange = (e) => {
    const value = e.target.value
    setConfirmPassword(value)

    if (value !== newPassword) {
      setConfirmPasswordError('Les mots de passe ne correspondent pas')
    } else {
      setConfirmPasswordError('')
    }
  }

  const handleSubmit = async (e) => {
    e.preventDefault()

    if (!validatePassword(newPassword)) {
      setNewPasswordError(
        'Le mot de passe doit contenir au moins 8 caractères, une majuscule, une minuscule et un chiffre',
      )
      return
    }

    if (newPassword !== confirmPassword) {
      setConfirmPasswordError('Les mots de passe ne correspondent pas')
      return
    }

    try {
      const response = await axios.post(
        'https://worktrack-server-muu6.onrender.com/api/auth/reset-password',
        {
          token,
          newPassword,
        },
      )

      if (response.data.success) {
        setSuccess(
          'Mot de passe réinitialisé avec succès. Redirection vers la page de connexion...',
        )
        setGlobalError('')
        setTimeout(() => {
          navigate('/login')
        }, 3000)
      } else {
        setGlobalError(response.data.error || 'Erreur lors de la réinitialisation du mot de passe')
      }
    } catch (err) {
      setGlobalError(err.response?.data?.error || 'Une erreur est survenue lors de la réinitialisation')
      setSuccess('')
    }
  }

  return (
    <div className="bg-body-tertiary min-vh-100 d-flex flex-row align-items-center">
      <CContainer>
        <CRow className="justify-content-center">
          <CCol md={6}>
            <CCardGroup>
              <CCard className="p-4">
                <CCardBody>
                  <CForm onSubmit={handleSubmit}>
                    <h1>Réinitialiser le mot de passe</h1>

                    {globalError && <CAlert color="danger">{globalError}</CAlert>}
                    {success && <CAlert color="success">{success}</CAlert>}

                    <div className="mb-3">
                      <CFormInput
                        type="password"
                        placeholder="Nouveau mot de passe"
                        value={newPassword}
                        onChange={handleNewPasswordChange}
                        required
                      />
                      {newPasswordError && <CFormText className="text-danger">{newPasswordError}</CFormText>}
                    </div>

                    <div className="mb-3">
                      <CFormInput
                        type="password"
                        placeholder="Confirmer le mot de passe"
                        value={confirmPassword}
                        onChange={handleConfirmPasswordChange}
                        required
                      />
                      {confirmPasswordError && (
                        <CFormText className="text-danger">{confirmPasswordError}</CFormText>
                      )}
                    </div>

                    <CButton color="primary" type="submit">
                      Réinitialiser le mot de passe
                    </CButton>
                  </CForm>
                </CCardBody>
              </CCard>
            </CCardGroup>
          </CCol>
        </CRow>
      </CContainer>
    </div>
  )
}

export default ResetPassword
