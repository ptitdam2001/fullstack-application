import { AppBar } from '@Common/components'
import { Outlet } from 'react-router-dom'

// export const DefaultLayout = () => {
//   return (
//     <Space direction="vertical" style={{ width: '100%' }} size={[0, 48]}>
//       <Layout style={{ height: '100vh' }}>
//         <Header data-testid="defaultLayout-header">

//         </Header>
//         <Content data-testid="defaultLayout-content">
//           <Outlet />
//         </Content>
//       </Layout>
//     </Space>
//   )
// }

export const DefaultLayout = () => {
  return (
    <main className="w-full h-full flex flex-col">
      <header data-testid="defaultLayout-header">
        <AppBar title="Main" />
      </header>
      <section role="main" data-testid="defaultLayout-content" className="flex flex-1 flex-col">
        <Outlet />
      </section>
      <footer></footer>
    </main>
  )
}
