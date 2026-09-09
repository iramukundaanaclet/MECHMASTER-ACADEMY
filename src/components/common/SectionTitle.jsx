const SectionTitle = ({ eyebrow, title, description, centered = false }) => {
  return (
    <div className={centered ? 'mx-auto max-w-2xl text-center' : 'max-w-2xl'}>
      {eyebrow ? <p className="mb-3 text-xs font-semibold uppercase tracking-[0.2em] text-[#FF7800]">{eyebrow}</p> : null}
      <h2 className="text-3xl font-bold tracking-tight text-[#0B1F33] md:text-4xl">{title}</h2>
      {description ? <p className="mt-4 text-base text-slate-600">{description}</p> : null}
    </div>
  )
}

export default SectionTitle
