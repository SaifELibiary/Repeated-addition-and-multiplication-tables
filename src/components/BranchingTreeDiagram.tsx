import React, { useRef, useEffect } from 'react';
import { CheckCircle2, HelpCircle, Sparkles } from 'lucide-react';

export interface BranchProblem {
  id: string;
  original: {
    factorA: number; // e.g. 8
    factorB: number; // e.g. 4
    splitTarget: 'factorA' | 'factorB'; // which factor is split
    splitVal1: number; // e.g. 5
    splitVal2: number; // e.g. 3
  };
  topBranch: {
    num1: number;
    num2: number;
    product: number;
  };
  bottomBranch: {
    num1: number;
    num2: number;
    product: number;
  };
  total: number;
  // Which fields are blank inputs for the student
  blanks: {
    topPart?: boolean;    // e.g. top split factor or multiplier
    topProd?: boolean;    // e.g. product of top branch
    botPart?: boolean;    // e.g. bottom split factor or multiplier
    botProd?: boolean;    // e.g. product of bottom branch
    total?: boolean;      // e.g. total sum
  };
  hint?: string;
}

interface BranchingTreeDiagramProps {
  problem: BranchProblem;
  values: {
    topPart?: string;
    topProd?: string;
    botPart?: string;
    botProd?: string;
    total?: string;
  };
  onChange: (field: string, val: string) => void;
  isCheckAttempted?: boolean;
  showSolution?: boolean;
  onCorrectField?: (field: string) => void;
  containerBg?: string;
}

export const BranchingTreeDiagram: React.FC<BranchingTreeDiagramProps> = ({
  problem,
  values,
  onChange,
  isCheckAttempted = false,
  showSolution = false,
  onCorrectField,
  containerBg = 'bg-white',
}) => {
  const topPartRef = useRef<HTMLInputElement>(null);
  const topProdRef = useRef<HTMLInputElement>(null);
  const botPartRef = useRef<HTMLInputElement>(null);
  const botProdRef = useRef<HTMLInputElement>(null);
  const totalRef = useRef<HTMLInputElement>(null);

  // Auto-focus logic when a student fills in a correct value
  const handleInputChange = (field: string, typedVal: string, expectedVal: number, nextRef?: React.RefObject<HTMLInputElement | null>) => {
    onChange(field, typedVal);
    const num = parseInt(typedVal.trim(), 10);
    if (num === expectedVal) {
      if (onCorrectField) onCorrectField(field);
      // Auto move focus to next input
      if (nextRef && nextRef.current) {
        setTimeout(() => {
          nextRef.current?.focus();
        }, 150);
      }
    }
  };

  const isTopPartCorrect = parseInt((values.topPart || '').trim(), 10) === (problem.blanks.topPart ? (problem.original.splitTarget === 'factorA' ? problem.topBranch.num1 : problem.topBranch.num2) : 0);
  const isTopProdCorrect = parseInt((values.topProd || '').trim(), 10) === problem.topBranch.product;
  const isBotPartCorrect = parseInt((values.botPart || '').trim(), 10) === (problem.blanks.botPart ? (problem.original.splitTarget === 'factorA' ? problem.bottomBranch.num1 : problem.bottomBranch.num2) : 0);
  const isBotProdCorrect = parseInt((values.botProd || '').trim(), 10) === problem.bottomBranch.product;
  const isTotalCorrect = parseInt((values.total || '').trim(), 10) === problem.total;

  const splitNotice = problem.original.splitTarget === 'factorA'
    ? `${problem.original.factorA} is broken into ${problem.original.splitVal1} + ${problem.original.splitVal2}`
    : `${problem.original.factorB} is broken into ${problem.original.splitVal1} + ${problem.original.splitVal2}`;

  return (
    <div className={`p-4 sm:p-6 rounded-3xl ${containerBg} border-2 border-amber-200/90 shadow-xs relative overflow-hidden transition-all hover:border-amber-300`}>
      {/* Top Header / Problem Statement */}
      <div className="flex flex-wrap items-center justify-between gap-2 border-b border-amber-100 pb-3 mb-4">
        <div className="flex items-center gap-2">
          <span className="px-3 py-1 rounded-full bg-amber-100 text-amber-900 font-fun font-bold text-xs tracking-wider uppercase">
            Decomposition Tree
          </span>
          <span className="text-xs font-bold text-amber-700 bg-amber-50 px-2.5 py-0.5 rounded-lg border border-amber-200">
            {splitNotice}
          </span>
        </div>

        {problem.hint && (
          <div className="flex items-center gap-1 text-xs text-slate-500 font-medium">
            <HelpCircle className="w-3.5 h-3.5 text-amber-500" />
            <span>{problem.hint}</span>
          </div>
        )}
      </div>

      {/* Main Diagram Area */}
      <div className="flex flex-col md:flex-row items-center justify-between gap-4 md:gap-8 py-2">
        {/* Left: Original Multiplication Expression */}
        <div className="flex flex-col items-center justify-center shrink-0">
          <div className="px-5 py-4 rounded-2xl bg-gradient-to-br from-amber-500 to-orange-500 text-white font-fun font-black text-2xl sm:text-3xl shadow-md flex items-center gap-2">
            <span>{problem.original.factorA}</span>
            <span className="text-amber-200">×</span>
            <span>{problem.original.factorB}</span>
          </div>

          <div className="mt-2 text-center">
            <span className="text-xs font-fun font-bold text-amber-800 bg-amber-100/80 px-2.5 py-1 rounded-full border border-amber-200">
              {problem.original.splitTarget === 'factorA'
                ? `(${problem.original.splitVal1} + ${problem.original.splitVal2}) × ${problem.original.factorB}`
                : `${problem.original.factorA} × (${problem.original.splitVal1} + ${problem.original.splitVal2})`}
            </span>
          </div>
        </div>

        {/* Center: SVG Connecting Curved Branches */}
        <div className="hidden md:flex flex-col items-center justify-center text-amber-400 w-16 h-44">
          <svg className="w-full h-full" viewBox="0 0 60 140" fill="none" xmlns="http://www.w3.org/2000/svg">
            {/* Top Branch Path */}
            <path
              d="M 5 70 C 25 70, 30 30, 55 30"
              stroke="#F59E0B"
              strokeWidth="4"
              strokeLinecap="round"
              fill="none"
            />
            {/* Bottom Branch Path */}
            <path
              d="M 5 70 C 25 70, 30 110, 55 110"
              stroke="#F59E0B"
              strokeWidth="4"
              strokeLinecap="round"
              fill="none"
            />
            {/* Center Origin Node */}
            <circle cx="5" cy="70" r="5" fill="#D97706" />
            {/* Branch Arrow Heads */}
            <polygon points="55,26 60,30 55,34" fill="#F59E0B" />
            <polygon points="55,106 60,110 55,114" fill="#F59E0B" />
          </svg>
        </div>

        {/* Right: The Two Branches (Top and Bottom equations) */}
        <div className="flex-1 w-full space-y-3">
          {/* Top Branch Card */}
          <div className="p-3.5 sm:p-4 rounded-2xl bg-sky-50/80 border-2 border-sky-200 flex flex-wrap items-center justify-between gap-3 shadow-2xs">
            <div className="flex items-center gap-2">
              <span className="text-xs font-bold px-2 py-0.5 rounded-md bg-sky-200 text-sky-800">
                Top Branch:
              </span>

              <div className="flex items-center gap-1.5 font-fun font-bold text-lg sm:text-xl text-sky-950">
                {/* Number 1 */}
                {problem.blanks.topPart && problem.original.splitTarget === 'factorA' ? (
                  <input
                    ref={topPartRef}
                    type="number"
                    value={showSolution ? problem.topBranch.num1 : (values.topPart || '')}
                    onChange={e =>
                      handleInputChange(
                        'topPart',
                        e.target.value,
                        problem.topBranch.num1,
                        problem.blanks.topProd ? topProdRef : botPartRef
                      )
                    }
                    placeholder="?"
                    className={`w-14 h-11 text-center font-fun font-black text-xl rounded-xl border-2 transition-all outline-hidden ${
                      isTopPartCorrect || showSolution
                        ? 'bg-emerald-100 border-emerald-400 text-emerald-800 ring-2 ring-emerald-300 animate-pulse'
                        : isCheckAttempted && !isTopPartCorrect
                        ? 'bg-rose-50 border-rose-400 text-rose-800 ring-2 ring-rose-200'
                        : 'bg-white border-sky-300 focus:border-sky-500 focus:ring-2 focus:ring-sky-200'
                    }`}
                  />
                ) : (
                  <span className="px-2.5 py-1 rounded-lg bg-sky-100 text-sky-900 border border-sky-200">
                    {problem.topBranch.num1}
                  </span>
                )}

                <span className="text-sky-600 font-bold">×</span>

                {/* Number 2 */}
                {problem.blanks.topPart && problem.original.splitTarget === 'factorB' ? (
                  <input
                    ref={topPartRef}
                    type="number"
                    value={showSolution ? problem.topBranch.num2 : (values.topPart || '')}
                    onChange={e =>
                      handleInputChange(
                        'topPart',
                        e.target.value,
                        problem.topBranch.num2,
                        problem.blanks.topProd ? topProdRef : botPartRef
                      )
                    }
                    placeholder="?"
                    className={`w-14 h-11 text-center font-fun font-black text-xl rounded-xl border-2 transition-all outline-hidden ${
                      isTopPartCorrect || showSolution
                        ? 'bg-emerald-100 border-emerald-400 text-emerald-800 ring-2 ring-emerald-300 animate-pulse'
                        : isCheckAttempted && !isTopPartCorrect
                        ? 'bg-rose-50 border-rose-400 text-rose-800 ring-2 ring-rose-200'
                        : 'bg-white border-sky-300 focus:border-sky-500 focus:ring-2 focus:ring-sky-200'
                    }`}
                  />
                ) : (
                  <span className="px-2.5 py-1 rounded-lg bg-sky-100 text-sky-900 border border-sky-200">
                    {problem.topBranch.num2}
                  </span>
                )}

                <span className="text-sky-600 font-bold">=</span>

                {/* Product */}
                {problem.blanks.topProd ? (
                  <input
                    ref={topProdRef}
                    type="number"
                    value={showSolution ? problem.topBranch.product : (values.topProd || '')}
                    onChange={e =>
                      handleInputChange(
                        'topProd',
                        e.target.value,
                        problem.topBranch.product,
                        problem.blanks.botPart ? botPartRef : (problem.blanks.botProd ? botProdRef : totalRef)
                      )
                    }
                    placeholder="?"
                    className={`w-18 h-11 text-center font-fun font-black text-xl rounded-xl border-2 transition-all outline-hidden ${
                      isTopProdCorrect || showSolution
                        ? 'bg-emerald-100 border-emerald-400 text-emerald-800 ring-2 ring-emerald-300'
                        : isCheckAttempted && !isTopProdCorrect
                        ? 'bg-rose-50 border-rose-400 text-rose-800 ring-2 ring-rose-200'
                        : 'bg-white border-sky-300 focus:border-sky-500 focus:ring-2 focus:ring-sky-200'
                    }`}
                  />
                ) : (
                  <span className="px-3 py-1 rounded-lg bg-sky-200 text-sky-950 font-black">
                    {problem.topBranch.product}
                  </span>
                )}
              </div>
            </div>

            {(isTopPartCorrect || !problem.blanks.topPart) && (isTopProdCorrect || !problem.blanks.topProd) && (
              <span className="text-emerald-600 flex items-center gap-1 text-xs font-bold">
                <CheckCircle2 className="w-4 h-4" /> Correct
              </span>
            )}

            {((isCheckAttempted && !isTopProdCorrect) || (Boolean(values.topProd) && (values.topProd || '').length >= String(problem.topBranch.product).length && !isTopProdCorrect)) && (
              <span className="text-xs font-bold text-rose-700 bg-rose-100 px-2.5 py-1 rounded-lg border border-rose-200 flex items-center gap-1 animate-fadeIn">
                <span>💡 Hint: Check {problem.topBranch.num1} × {problem.topBranch.num2} = ?</span>
              </span>
            )}
          </div>

          {/* Bottom Branch Card */}
          <div className="p-3.5 sm:p-4 rounded-2xl bg-indigo-50/80 border-2 border-indigo-200 flex flex-wrap items-center justify-between gap-3 shadow-2xs">
            <div className="flex items-center gap-2">
              <span className="text-xs font-bold px-2 py-0.5 rounded-md bg-indigo-200 text-indigo-800">
                Bottom Branch:
              </span>

              <div className="flex items-center gap-1.5 font-fun font-bold text-lg sm:text-xl text-indigo-950">
                {/* Number 1 */}
                {problem.blanks.botPart && problem.original.splitTarget === 'factorA' ? (
                  <input
                    ref={botPartRef}
                    type="number"
                    value={showSolution ? problem.bottomBranch.num1 : (values.botPart || '')}
                    onChange={e =>
                      handleInputChange(
                        'botPart',
                        e.target.value,
                        problem.bottomBranch.num1,
                        problem.blanks.botProd ? botProdRef : totalRef
                      )
                    }
                    placeholder="?"
                    className={`w-14 h-11 text-center font-fun font-black text-xl rounded-xl border-2 transition-all outline-hidden ${
                      isBotPartCorrect || showSolution
                        ? 'bg-emerald-100 border-emerald-400 text-emerald-800 ring-2 ring-emerald-300 animate-pulse'
                        : isCheckAttempted && !isBotPartCorrect
                        ? 'bg-rose-50 border-rose-400 text-rose-800 ring-2 ring-rose-200'
                        : 'bg-white border-indigo-300 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-200'
                    }`}
                  />
                ) : (
                  <span className="px-2.5 py-1 rounded-lg bg-indigo-100 text-indigo-900 border border-indigo-200">
                    {problem.bottomBranch.num1}
                  </span>
                )}

                <span className="text-indigo-600 font-bold">×</span>

                {/* Number 2 */}
                {problem.blanks.botPart && problem.original.splitTarget === 'factorB' ? (
                  <input
                    ref={botPartRef}
                    type="number"
                    value={showSolution ? problem.bottomBranch.num2 : (values.botPart || '')}
                    onChange={e =>
                      handleInputChange(
                        'botPart',
                        e.target.value,
                        problem.bottomBranch.num2,
                        problem.blanks.botProd ? botProdRef : totalRef
                      )
                    }
                    placeholder="?"
                    className={`w-14 h-11 text-center font-fun font-black text-xl rounded-xl border-2 transition-all outline-hidden ${
                      isBotPartCorrect || showSolution
                        ? 'bg-emerald-100 border-emerald-400 text-emerald-800 ring-2 ring-emerald-300 animate-pulse'
                        : isCheckAttempted && !isBotPartCorrect
                        ? 'bg-rose-50 border-rose-400 text-rose-800 ring-2 ring-rose-200'
                        : 'bg-white border-indigo-300 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-200'
                    }`}
                  />
                ) : (
                  <span className="px-2.5 py-1 rounded-lg bg-indigo-100 text-indigo-900 border border-indigo-200">
                    {problem.bottomBranch.num2}
                  </span>
                )}

                <span className="text-indigo-600 font-bold">=</span>

                {/* Product */}
                {problem.blanks.botProd ? (
                  <input
                    ref={botProdRef}
                    type="number"
                    value={showSolution ? problem.bottomBranch.product : (values.botProd || '')}
                    onChange={e =>
                      handleInputChange(
                        'botProd',
                        e.target.value,
                        problem.bottomBranch.product,
                        totalRef
                      )
                    }
                    placeholder="?"
                    className={`w-18 h-11 text-center font-fun font-black text-xl rounded-xl border-2 transition-all outline-hidden ${
                      isBotProdCorrect || showSolution
                        ? 'bg-emerald-100 border-emerald-400 text-emerald-800 ring-2 ring-emerald-300'
                        : isCheckAttempted && !isBotProdCorrect
                        ? 'bg-rose-50 border-rose-400 text-rose-800 ring-2 ring-rose-200'
                        : 'bg-white border-indigo-300 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-200'
                    }`}
                  />
                ) : (
                  <span className="px-3 py-1 rounded-lg bg-indigo-200 text-indigo-950 font-black">
                    {problem.bottomBranch.product}
                  </span>
                )}
              </div>
            </div>

            {(isBotPartCorrect || !problem.blanks.botPart) && (isBotProdCorrect || !problem.blanks.botProd) && (
              <span className="text-emerald-600 flex items-center gap-1 text-xs font-bold">
                <CheckCircle2 className="w-4 h-4" /> Correct
              </span>
            )}

            {((isCheckAttempted && !isBotProdCorrect) || (Boolean(values.botProd) && (values.botProd || '').length >= String(problem.bottomBranch.product).length && !isBotProdCorrect)) && (
              <span className="text-xs font-bold text-rose-700 bg-rose-100 px-2.5 py-1 rounded-lg border border-rose-200 flex items-center gap-1 animate-fadeIn">
                <span>💡 Hint: Check {problem.bottomBranch.num1} × {problem.bottomBranch.num2} = ?</span>
              </span>
            )}
          </div>
        </div>
      </div>

      {/* Bottom Total Sum Row */}
      <div className="mt-4 pt-3 border-t-2 border-dashed border-amber-200 flex flex-wrap items-center justify-between gap-3 bg-amber-50/70 p-3 rounded-2xl">
        <div className="flex items-center gap-2">
          <span className="font-fun font-bold text-amber-900 text-sm">
            Add Both Branches Together:
          </span>
          <span className="text-xs font-bold text-slate-500">
            ({problem.topBranch.product} + {problem.bottomBranch.product})
          </span>
        </div>

        <div className="flex flex-wrap items-center gap-2">
          <span className="font-fun font-black text-base text-amber-950">
            A total of:
          </span>

          {problem.blanks.total ? (
            <input
              ref={totalRef}
              type="number"
              value={showSolution ? problem.total : (values.total || '')}
              onChange={e => handleInputChange('total', e.target.value, problem.total)}
              placeholder="Total"
              className={`w-24 h-12 text-center font-fun font-black text-2xl rounded-2xl border-2 transition-all outline-hidden ${
                isTotalCorrect || showSolution
                  ? 'bg-emerald-100 border-emerald-500 text-emerald-800 ring-3 ring-emerald-300'
                  : isCheckAttempted && !isTotalCorrect
                  ? 'bg-rose-50 border-rose-400 text-rose-800 ring-2 ring-rose-200'
                  : 'bg-white border-amber-400 focus:border-amber-600 focus:ring-2 focus:ring-amber-200'
              }`}
            />
          ) : (
            <span className="px-4 py-1.5 rounded-xl bg-amber-500 text-white font-fun font-black text-2xl shadow-xs">
              {problem.total}
            </span>
          )}

          {isTotalCorrect && (
            <span className="text-emerald-600 font-bold text-xs flex items-center gap-1">
              <Sparkles className="w-4 h-4" /> Perfect!
            </span>
          )}

          {((isCheckAttempted && !isTotalCorrect) || (Boolean(values.total) && (values.total || '').length >= String(problem.total).length && !isTotalCorrect)) && (
            <span className="text-xs font-bold text-rose-700 bg-rose-100 px-2.5 py-1 rounded-lg border border-rose-200 flex items-center gap-1 animate-fadeIn">
              <span>💡 Hint: Add {problem.topBranch.product} + {problem.bottomBranch.product} = ?</span>
            </span>
          )}
        </div>
      </div>
    </div>
  );
};
