import moment from 'moment'

export default {
  SHORT_TEXT: 'shortText',
  CHECKBOX: 'checkbox',
  SELECT: 'select',
  RADIO: 'radio',
  NUMBER: 'number',
  LONG_TEXT: 'longText',
  EMAIL: 'email',
  SINGLE_UPLOAD: 'singleUpload',
  MULTI_UPLOAD: 'multiUpload',
  SINGLE_SELECT: 'singleSelect',
  MULTI_SELECT: 'multiSelect',
  DATE: 'date'
}

export const mainForm = [
  {
    title: 'Pilih Jadwal & Tiket',
    form: [
      {
        isRequired: true,
        label: 'Pilih Image',
        prop: 'image',
        type: 'singleUpload',
        placeholder: 'Pilih gambarmu'
      },
      {
        isRequired: true,
        label: 'Jenis Tiket Multi',
        prop: 'multi',
        type: 'multiSelect',
        options: [{ name: 'Tiket Masuk 1', id: 1 }, { name: 'Tiket Masuk 2', id: 2 }],
        placeholder: 'Pilih tiketmu'
      },
      {
        isRequired: true,
        label: 'Jenis Tiket Single',
        prop: 'pakage',
        type: 'singleSelect',
        options: [{ name: 'Tiket Masuk', id: 1 }],
        placeholder: 'Pilih tiketmu'
      },
      {
        isRequired: true,
        label: 'Pilih Tanggal',
        type: 'date',
        prop: 'ticketDate',
        disabledDate: current => current && current < moment().startOf('day'),
        placeholder: 'Tulis Tanggal'
      }
    ]
  },
  {
    title: 'Identitas diri',
    form: [
      {
        isRequired: true,
        label: 'Umur',
        prop: 'age',
        type: 'number',
        placeholder: 'Tulis umurmu'
      }
    ]
  }
]
