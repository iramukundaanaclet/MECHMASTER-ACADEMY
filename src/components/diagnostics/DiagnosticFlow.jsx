const DiagnosticFlow = ({ diagnostics }) => {
  return (
    <div className="grid gap-6 lg:grid-cols-2">
      {diagnostics.map((item) => (
        <div key={item.id} className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
          <p className="text-xs font-semibold uppercase tracking-[0.16em] text-[#FF7800]">{item.category}</p>
          <h3 className="mt-3 text-2xl font-bold text-[#0B1F33]">{item.symptom}</h3>
          <div className="mt-5 space-y-5 text-sm text-slate-600">
            <div>
              <h4 className="mb-2 font-semibold text-[#0B1F33]">Possible causes</h4>
              <ul className="list-disc space-y-1 pl-5">
                {item.possibleCauses.map((cause) => (
                  <li key={cause}>{cause}</li>
                ))}
              </ul>
            </div>
            <div>
              <h4 className="mb-2 font-semibold text-[#0B1F33]">Test</h4>
              <ul className="list-disc space-y-1 pl-5">
                {item.tests.map((test) => (
                  <li key={test}>{test}</li>
                ))}
              </ul>
            </div>
            <div>
              <h4 className="mb-2 font-semibold text-[#0B1F33]">Solution</h4>
              <p>{item.solution}</p>
            </div>
          </div>
        </div>
      ))}
    </div>
  )
}

export default DiagnosticFlow
