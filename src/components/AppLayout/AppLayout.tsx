import { Outlet } from 'react-router-dom'

const AppLayout = () => {
  return (
    <div className="flex h-svh">
      <div className="flex flex-col flex-1">
        <main className="flex flex-col flex-1 overflow-y-auto bg-light p-6 z-30">
          <Outlet />
        </main>
      </div>
    </div>
  )
}

export default AppLayout