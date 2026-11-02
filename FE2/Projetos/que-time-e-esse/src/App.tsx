import { Route, Routes } from 'react-router-dom'
import Jogo from './paginas/Jogo'

function App() {
  return (
    <div className="flex min-h-dvh flex-col bg-stone-600 text-stone-100">
      <Routes>
        <Route path="/" element={<Jogo />} />
      </Routes>
    </div>
  )
}

export default App
