import './index.css'

function App() {
  return (
    <div className="min-h-screen bg-base-200 flex items-center justify-center p-4">
      <div className="card bg-base-100 shadow-xl max-w-md w-full">
        <div className="card-body">
          <h1 className="text-3xl font-bold text-primary text-center">
            Cloud Kitchen Billing Dashboard
          </h1>
          <p className="text-center mt-2">Tailwind v4 + daisyUI v5 ready</p>
          
          <div className="flex flex-col gap-4 mt-6">
            <button className="btn btn-primary">Primary Button</button>
            <button className="btn btn-secondary">Secondary Button</button>
            <button className="btn btn-outline">Outline Button</button>
          </div>
        </div>
      </div>
    </div>
  )
}

export default App