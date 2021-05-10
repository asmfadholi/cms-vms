export const form = [
  {
    title: 'Visitor Wahana',
    form: [
      {
        isRequired: true,
        label: 'Kode Booking',
        prop: 'bookingCode',
        type: 'shortText',
        placeholder: 'Masukkan Kode Booking'
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
    dataIndex: 'createdAtByBe',
    key: 'createdAtByBe'
  }
]
