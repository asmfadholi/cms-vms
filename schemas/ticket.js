import moment from 'moment'

export const form = [
  {
    title: 'Pilih Jadwal & Tiket',
    form: [
      {
        isRequired: true,
        label: 'Jenis Tiket',
        prop: 'package',
        type: 'singleSelect',
        options: [{ name: 'Tiket Masuk 1', id: 1 }, { name: 'Tiket Masuk 2', id: 2 }],
        placeholder: 'Pilih Tiketmu'
      },
      {
        isRequired: true,
        label: 'Pilih Tanggal',
        type: 'date',
        prop: 'ticketDate',
        disabledDate: current => current && current < moment().endOf('day'),
        placeholder: 'Tulis Tanggal'
      }
    ]
  },
  {
    title: 'Identitas diri',
    form: [
      {
        isRequired: true,
        label: 'Nama',
        prop: 'name',
        type: 'shortText',
        placeholder: 'Tulis Namamu'
      },
      {
        isRequired: true,
        label: 'Email',
        prop: 'email',
        type: 'email',
        rules: [{ type: 'email', message: 'Must be of type email', trigger: 'change' }],
        placeholder: 'Tulis Emailmu'
      },
      {
        isRequired: true,
        label: 'No. Handphone',
        prop: 'phoneNumber',
        type: 'number',
        placeholder: 'Tulis No. Handphonemu'
      },
      {
        isRequired: true,
        label: 'Jenis Kelamin',
        prop: 'gender',
        options: [{ name: 'Laki-laki', id: 'laki-laki' }, { name: 'Perempuan', id: 'perempuan' }],
        type: 'radio'
      }
    ]
  }
]

export const customColumns = [
  {
    dataIndex: 'bookingCode',
    key: 'bookingCode',
    title: 'Kode Booking',
    fixed: 'left'
  },
  {
    title: 'Nama',
    dataIndex: 'name',
    key: 'name',
    width: '130px',
    fixed: 'left'
  },
  {
    title: 'Email',
    dataIndex: 'email',
    key: 'email'
  },
  {
    title: 'Tanggal',
    dataIndex: 'ticketDate',
    key: 'ticketDate'
  }
]
