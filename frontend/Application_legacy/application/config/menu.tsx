import { BarChartOutlined } from '@Common/components'
import { MenuItemProp } from '@Common/types'

export default [
  {
    label: 'First page',
    link: 'my-first-page',
    icon: <BarChartOutlined />,
  },
  {
    label: 'Second page',
    link: 'my-second-page',
    icon: <BarChartOutlined />,
    children: [
      {
        label: 'Second bis',
        link: '/my-second-page/bis',
        icon: <BarChartOutlined />,
      },
    ],
  },
] as MenuItemProp[]
