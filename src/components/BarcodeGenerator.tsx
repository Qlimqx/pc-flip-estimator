import JsBarcode from 'jsbarcode'
import { useEffect, useRef, useState } from 'react'
import { buildConfigLabel } from '../lib/barcodeConfig'
import { allocateNextEan } from '../lib/eanSequence'
import { useEstimatorStore } from '../store/useEstimatorStore'

export function BarcodeGenerator() {
  const config = useEstimatorStore((s) => s.config)
  const svgRef = useRef<SVGSVGElement>(null)
  const [ean, setEan] = useState<string | null>(null)
  const [designation, setDesignation] = useState('')
  const [copied, setCopied] = useState<'ean' | 'designation' | null>(null)

  useEffect(() => {
    if (!ean || !svgRef.current) return
    JsBarcode(svgRef.current, ean, {
      format: 'EAN13',
      width: 2,
      height: 70,
      fontSize: 14,
      margin: 6,
      background: '#ffffff',
      lineColor: '#0f172a',
    })
  }, [ean])

  function handleGenerate() {
    // La désignation est figée au moment de la génération -- le code EAN
    // devient l'identifiant permanent de cette unité physique, elle ne doit
    // pas dériver silencieusement si la config est modifiée après coup.
    setDesignation(buildConfigLabel(config))
    setEan(allocateNextEan())
    setCopied(null)
  }

  function handleCopy(text: string, which: 'ean' | 'designation') {
    void navigator.clipboard.writeText(text).then(() => {
      setCopied(which)
      window.setTimeout(() => setCopied(null), 1500)
    })
  }

  function handleDownload() {
    const svg = svgRef.current
    if (!svg || !ean) return
    const svgData = new XMLSerializer().serializeToString(svg)
    const svgBlob = new Blob([svgData], { type: 'image/svg+xml;charset=utf-8' })
    const url = URL.createObjectURL(svgBlob)
    const img = new Image()
    img.onload = () => {
      const canvas = document.createElement('canvas')
      canvas.width = img.width * 2
      canvas.height = img.height * 2
      const ctx = canvas.getContext('2d')
      URL.revokeObjectURL(url)
      if (!ctx) return
      ctx.scale(2, 2)
      ctx.drawImage(img, 0, 0)
      canvas.toBlob((blob) => {
        if (!blob) return
        const a = document.createElement('a')
        a.href = URL.createObjectURL(blob)
        a.download = `ean-${ean}.png`
        a.click()
        URL.revokeObjectURL(a.href)
      })
    }
    img.src = url
  }

  return (
    <div className="rounded-xl border border-slate-800 bg-slate-900/50 p-3">
      {!ean ? (
        <button
          type="button"
          onClick={handleGenerate}
          className="w-full rounded-lg bg-emerald-600 px-4 py-2 text-sm font-semibold text-white hover:bg-emerald-500"
        >
          Générer un code EAN (Athena)
        </button>
      ) : (
        <>
          <div className="inline-block rounded-lg bg-white p-1">
            <svg ref={svgRef} />
          </div>

          <p className="mt-2 break-words rounded-lg border border-slate-800 bg-slate-950/50 p-1.5 font-mono text-[11px] text-slate-300">
            {designation}
          </p>

          <div className="mt-2 flex flex-wrap gap-1.5">
            <button
              type="button"
              onClick={() => handleCopy(designation, 'designation')}
              className="rounded-lg border border-slate-700 px-2 py-1 text-[11px] text-slate-300 hover:border-slate-600"
            >
              {copied === 'designation' ? 'Copié ✓' : 'Copier désignation'}
            </button>
            <button
              type="button"
              onClick={() => handleCopy(ean, 'ean')}
              className="rounded-lg border border-slate-700 px-2 py-1 text-[11px] text-slate-300 hover:border-slate-600"
            >
              {copied === 'ean' ? 'Copié ✓' : 'Copier EAN'}
            </button>
            <button
              type="button"
              onClick={handleDownload}
              className="rounded-lg border border-slate-700 px-2 py-1 text-[11px] text-slate-300 hover:border-slate-600"
            >
              PNG
            </button>
            <button
              type="button"
              onClick={handleGenerate}
              className="rounded-lg border border-amber-700/50 px-2 py-1 text-[11px] text-amber-500 hover:border-amber-600"
            >
              Nouveau code
            </button>
          </div>
        </>
      )}
    </div>
  )
}
