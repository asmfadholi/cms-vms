export const form = [
  {
    title: 'About Area',
    form: [
      {
        isRequired: true,
        label: 'Images',
        prop: 'images',
        type: 'multiUpload'
      },
      {
        isRequired: true,
        label: 'Name',
        prop: 'name',
        type: 'shortText',
        placeholder: 'Pilih Nama Area'
      },
      {
        isRequired: true,
        label: 'Description',
        prop: 'description',
        type: 'longText',
        placeholder: 'Masukkan Description'
      },
      {
        isRequired: true,
        label: 'max Quota',
        prop: 'maxQuota',
        type: 'number',
        placeholder: 'Masukkan maksimum kuota'
      },
      {
        isRequired: true,
        label: 'Location',
        prop: 'location',
        type: 'longText',
        placeholder: 'Masukkan Lokasi'
      }
    ]
  }
]

export const customColumns = [
  {
    dataIndex: 'id',
    key: 'id',
    title: 'ID',
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
    title: 'Location',
    dataIndex: 'location',
    key: 'location'
  },
  {
    title: 'Max Quota',
    dataIndex: 'maxQuota',
    key: 'maxQuota'
  }
]
