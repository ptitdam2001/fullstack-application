import { MyProfilMenu, Signout } from '@Authentication/components'
import { AppBar } from '@Common/components'
import { memo } from 'react'
// import { styled } from 'styled-components'

// const Row = styled.div`
//   display: flex;
//   flex-direction: row;
//   align-items: middle;
//   justify-content: center;
// `
// const Col = styled.span``

export const ApplicationBar = memo(() => (
    <AppBar
      logo={{
        img: <img src="/img/logo.jpg" />,
        url: '/app',
      }}
      title="Welcome"
      rightContent={
        <span className="flex flex-row">
          <MyProfilMenu />
          <Signout redirect="/auth/signin" />
        </span>
      }
      fixed
    />
  )
)
