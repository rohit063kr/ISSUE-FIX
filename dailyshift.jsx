/* eslint-disable react/react-in-jsx-scope */
import React, { useState, useEffect } from 'react'
import Axios from 'axios'
import {
  CCol,
  CContainer,
  CRow,
  CButton,
  CForm,
  CFormInput,
  CInputGroup,
  CFormSelect,
  CTableRow,
  CTable,
  CTableHead,
  CTableBody,
  CTableHeaderCell,
  CTableDataCell,
} from '@coreui/react'
import { cilTrash, cilPlus } from '@coreui/icons'
import CIcon from '@coreui/icons-react'
import { toast } from 'react-toastify'
// import { useHistory } from 'react-router-dom'

export default function DailyShift() {
  const [lineName, setLineName] = useState([])
  const [assoList, setAsso] = useState([])
  const [lineShift, setlineShift] = useState([])
  const [currentLine, setCurrentLine] = useState({
    currentLineItem: '',
  })

  function hanleSubmit(e) {
    e.preventDefault()
    Axios.post(
      '/dailylineshift',
      assoList.map((val) => {
        return { id: val.id, Associates: val.Associates }
      }),
    ).then((res) => {
      toast.success('Update saved')
    })
    return false
  }
  useEffect(() => {
    Axios.get('/linetable').then((res) => {
      setLineName([...res.data['linetable']])
    })
  }, [])

  useEffect(() => {
    Axios.get('/dailylineshift').then((res) => {
      const dls = res.data['flag'].map((d) => {
        return {
          ...d,
          rate: Math.floor(d.plan / d.Associates),
          updateplan: d.plan,
        }
      })
      setAsso([...dls])
    })
  }, [])

  const handleChange = (event) => {
    currentLine['currentLineItem'] = event.target.value
    console.log(currentLine['currentLineItem'])
    Axios.get('/lineshiftdata', { params: { line_number: currentLine['currentLineItem'] } }).then(
      (res) => {
        setlineShift(res['data']['shiftdata'])
        // eslint-disable-next-line
      },
    )
  }
  let lineManager = [
    { id: '', name: 'select manager' },
    { id: 1, name: 'Shyam' },
    { id: 2, name: 'Gopal' },
    { id: 3, name: 'Ganesh' },
    { id: 4, name: 'Sita' },
  ]

  const assoTable = assoList.map((aso, ky) => {
    return (
      <CTableRow key={ky}>
        <CTableDataCell scope="col">{aso.shift_starttime}</CTableDataCell>
        <CTableDataCell scope="col">{aso.shift_endtime}</CTableDataCell>
        <CTableDataCell scope="col">
          <CFormInput
            type="number"
            min={0}
            placeholder={`Associates`}
            aria-label={`Associates`}
            value={aso.Associates}
            onChange={(e) => {
              setAsso([
                ...assoList.map((val) => {
                  if (val.id === aso.id) {
                    return {
                      ...val,
                      Associates: parseInt(e.target.value),
                      updateplan: val.rate * parseInt(e.target.value),
                    }
                  }
                  return val
                }),
              ])
            }}
            required
          />
        </CTableDataCell>
        <CTableDataCell scope="col">{aso.plan}</CTableDataCell>
        <CTableDataCell scope="col">{aso.updateplan}</CTableDataCell>
      </CTableRow>
    )
  })
  return (
    <>
      <CForm className="needs-validation" validation={true} onSubmit={hanleSubmit}>
        <CContainer className="mb-3">
          <h4>Daily Shifts</h4>
          <CRow className="pb-2">
            <CCol xs={3}>
              <CInputGroup>
                <CFormSelect name={`linename`} required onChange={(e) => handleChange(e)}>
                  {lineName.map((item) => {
                    return (
                      <option key={item.id} value={item.id}>
                        {item.line_name}
                      </option>
                    )
                  })}
                </CFormSelect>
              </CInputGroup>
            </CCol>
            <CCol xs={3}>
              <CInputGroup>
                <CFormSelect name={`linename`} required onChange={(e) => handleChange(e)}>
                  <option value={''}>Select date...</option>
                  <option value={'today'}>Today</option>
                  <option value={'tomorrow'}>Tomorrow</option>
                </CFormSelect>
              </CInputGroup>
            </CCol>
            <CCol xs={3}>
              <CInputGroup>
                <CFormSelect name={`shiftselect`} required>
                  {lineManager.map((row, index) => (
                    <option key={row.id} value={row.name}>
                      {row.name}
                    </option>
                  ))}
                </CFormSelect>
              </CInputGroup>
            </CCol>
          </CRow>
          <CRow className="pb-2">
            <CCol xs={3}>
              <CInputGroup>
                <CFormSelect name={`shiftselect`} required>
                  {lineShift.map((row, index) => (
                    <option key={row[0]} value={row[1]}>
                      {row[1]}
                    </option>
                  ))}
                </CFormSelect>
              </CInputGroup>
            </CCol>
          </CRow>
        </CContainer>
        <p style={{ borderBottom: '1px solid #dfdddd', width: '100%' }}></p>
        <CContainer>
          <CTable>
            <CTableHead>
              <CTableRow>
                <CTableHeaderCell scope="col">Start TIME</CTableHeaderCell>
                <CTableHeaderCell scope="col">End TIME</CTableHeaderCell>
                <CTableHeaderCell scope="col">Actual Accociates</CTableHeaderCell>
                <CTableHeaderCell scope="col">Plan</CTableHeaderCell>
                <CTableHeaderCell scope="col">Updated Plan</CTableHeaderCell>
              </CTableRow>
            </CTableHead>
            <CTableBody>{assoTable}</CTableBody>
          </CTable>
        </CContainer>
        <CContainer>
          <CRow className="justify-content-end pb-2">
            <CCol xs={1}>
              <CButton type="submit" color="primary">
                Submit
              </CButton>
            </CCol>
          </CRow>
        </CContainer>
      </CForm>
    </>
  )
}
