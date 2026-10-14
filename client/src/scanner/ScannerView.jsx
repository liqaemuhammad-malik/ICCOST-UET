import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent } from '@/components/ui/card';
import { QrCode, CheckCircle2, AlertTriangle, XCircle, Search, ShieldCheck } from 'lucide-react';

export function ScannerView() {
  const [scanMode, setScanMode] = useState('GATE'); // 'GATE' | 'SESSION' | 'MEAL'
  const [manualCode, setManualCode] = useState('');
  const [scanResult, setScanResult] = useState(null); // { status: 'OK'|'ALREADY_REDEEMED'|'INELIGIBLE', name: '', details: '' }

  const handleSimulateScan = (code) => {
    let cardPayload = null;
    try {
      const parsed = JSON.parse(code);
      if (parsed.cardId) cardPayload = parsed;
    } catch {
      try {
        const parsedUrl = new URL(code);
        if (parsedUrl.pathname.endsWith('/verify-card')) {
          cardPayload = {
            cardId: parsedUrl.searchParams.get('cardId'),
            name: parsedUrl.searchParams.get('name'),
            category: parsedUrl.searchParams.get('category'),
          };
        }
      } catch {
        // Plain pass tokens continue to use the demo response below.
      }
    }

    if (cardPayload) {
      setScanResult({
        status: 'OK',
        title: 'VERIFIED CARD',
        attendee: cardPayload.name || 'Card Holder',
        category: cardPayload.category || 'ATTENDEE_PARTICIPANT',
        identityId: cardPayload.cardId,
        station: `${scanMode} SCAN STATION 1`,
        time: new Date().toLocaleTimeString(),
        badgeVariant: 'success',
      });
      return;
    }

    // Plain pass-token preview demonstration
    if (code.toUpperCase().includes('GATE') || code.length > 5) {
      setScanResult({
        status: 'OK',
        title: 'VERIFIED & GRANTED',
        attendee: 'Prof. Muhammad Ali (UET Lahore)',
        category: 'STUDENT_FACULTY',
        station: `${scanMode} SCAN STATION 1`,
        time: new Date().toLocaleTimeString(),
        badgeVariant: 'success',
      });
    } else {
      setScanResult({
        status: 'ALREADY_REDEEMED',
        title: 'DUPLICATE SCAN ALERT',
        attendee: 'Sample Participant',
        category: 'VISITOR_EXHIBITION',
        station: `${scanMode} SCAN STATION 1`,
        details: 'Pass token was already scanned at 11:42 AM today.',
        badgeVariant: 'destructive',
      });
    }
  };

  return (
    <div className="space-y-4">
      {/* Station Mode Toggle */}
      <div className="grid grid-cols-3 gap-1.5 bg-black p-1 rounded-lg border border-slate-800">
        <button
          onClick={() => {
            setScanMode('GATE');
            setScanResult(null);
          }}
          className={`py-2 text-xs font-bold rounded transition-colors ${
            scanMode === 'GATE' ? 'bg-emerald-600 text-white' : 'text-slate-400 hover:text-white'
          }`}
        >
          Gate Entry
        </button>
        <button
          onClick={() => {
            setScanMode('SESSION');
            setScanResult(null);
          }}
          className={`py-2 text-xs font-bold rounded transition-colors ${
            scanMode === 'SESSION' ? 'bg-emerald-600 text-white' : 'text-slate-400 hover:text-white'
          }`}
        >
          Session / Hall
        </button>
        <button
          onClick={() => {
            setScanMode('MEAL');
            setScanResult(null);
          }}
          className={`py-2 text-xs font-bold rounded transition-colors ${
            scanMode === 'MEAL' ? 'bg-emerald-600 text-white' : 'text-slate-400 hover:text-white'
          }`}
        >
          Meal Counter
        </button>
      </div>

      {/* Camera Viewport Simulation / html5-qrcode hook container */}
      <div className="relative aspect-square w-full rounded-2xl bg-black border-2 border-slate-700 flex flex-col items-center justify-center overflow-hidden">
        <div className="w-56 h-56 border-2 border-dashed border-emerald-500/80 rounded-xl flex flex-col items-center justify-center p-4 text-center">
          <QrCode className="w-16 h-16 text-emerald-400 mb-2 animate-pulse" />
          <p className="text-xs text-slate-300 font-semibold">Align Participant QR Pass Inside Frame</p>
          <span className="text-[10px] text-slate-500 mt-1">High-Speed Scanner Active</span>
        </div>
      </div>

      {/* Manual Input Fallback */}
      <div className="flex gap-2">
        <Input
          value={manualCode}
          onChange={(e) => setManualCode(e.target.value)}
          placeholder="Or Enter Pass Token / Reg ID"
          className="bg-slate-800 border-slate-700 text-white text-xs h-10"
        />
        <Button
          onClick={() => handleSimulateScan(manualCode || 'ICOSST26-000101')}
          className="bg-emerald-600 hover:bg-emerald-500 text-white text-xs shrink-0"
        >
          <Search className="w-4 h-4 mr-1" /> Scan
        </Button>
      </div>

      {/* High-Contrast Mobile Status Result Screen */}
      {scanResult && (
        <div
          className={`rounded-2xl p-6 text-white text-center shadow-2xl transition-all ${
            scanResult.status === 'OK'
              ? 'bg-emerald-600 border-4 border-emerald-400'
              : 'bg-rose-600 border-4 border-rose-400'
          }`}
        >
          {scanResult.status === 'OK' ? (
            <CheckCircle2 className="w-16 h-16 mx-auto mb-2 text-white" />
          ) : (
            <XCircle className="w-16 h-16 mx-auto mb-2 text-white" />
          )}

          <h2 className="text-2xl font-black tracking-wide font-heading uppercase">{scanResult.title}</h2>
          {scanResult.status === 'OK' ? (
            <div className="mt-4 overflow-hidden rounded-xl bg-white text-left text-slate-900 shadow-xl">
              <div className="border-b-2 border-amber-400 bg-white px-4 py-2">
                <div className="flex items-center justify-between gap-2">
                  <img src="/uet-logo.png" alt="UET Lahore" className="h-10 w-10 object-contain" />
                  <img src="/icosst-logo.png" alt="ICOSST 2026" className="h-10 flex-1 object-contain" />
                  <img src="/kics-logo.png" alt="KICS UET Lahore" className="h-10 w-10 object-contain" />
                </div>
              </div>
              <div className="bg-emerald-950 px-4 py-3 text-white">
                <div className="flex items-center justify-between gap-3">
                  <div>
                    <p className="text-[9px] font-bold uppercase tracking-[0.2em] text-emerald-200">Verified Holding Card</p>
                    <p className="mt-1 text-lg font-extrabold">{scanResult.attendee}</p>
                  </div>
                  <Badge className="shrink-0 gap-1 bg-emerald-500 text-white border-emerald-300">
                    <CheckCircle2 className="h-3 w-3" /> VERIFIED
                  </Badge>
                </div>
              </div>
              <div className="grid grid-cols-2 gap-3 px-4 py-3 text-xs">
                <div>
                  <p className="text-[9px] font-bold uppercase text-slate-400">Identification</p>
                  <p className="break-all font-mono font-bold text-emerald-900">{scanResult.identityId || 'VALID PASS'}</p>
                </div>
                <div>
                  <p className="text-[9px] font-bold uppercase text-slate-400">Category</p>
                  <p className="font-semibold capitalize">{scanResult.category.replaceAll('_', ' ').toLowerCase()}</p>
                </div>
              </div>
            </div>
          ) : (
            <>
              <p className="text-base font-bold mt-1 text-white/95">{scanResult.attendee}</p>
          <div className="mt-2 inline-block bg-black/30 px-3 py-1 rounded-full text-xs font-semibold">
            {scanResult.category} • {scanResult.station}
          </div>

            </>
          )}

          {scanResult.details && (
            <p className="text-xs mt-3 bg-black/40 p-2 rounded-lg text-white font-medium">
              {scanResult.details}
            </p>
          )}

          <Button
            onClick={() => setScanResult(null)}
            className="mt-5 w-full bg-black/40 hover:bg-black/60 text-white font-bold text-sm h-11"
          >
            Ready Next Scan
          </Button>
        </div>
      )}
    </div>
  );
}
