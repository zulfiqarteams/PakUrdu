import type { ReactNode } from "react";
import type { FingerGuide, Finger } from "@/features/keyboard/data/fingerGuide";

interface HandFingerGuideProps {
  activeGuide: FingerGuide | null;
}

function isActive(activeGuide: FingerGuide | null, hand: "Left" | "Right", finger: Finger) {
  return activeGuide?.hand === hand && activeGuide.finger === finger;
}

function FingerPart({
  activeGuide,
  hand,
  finger,
  labelX,
  children,
}: {
  activeGuide: FingerGuide | null;
  hand: "Left" | "Right";
  finger: Finger;
  labelX: number;
  children: ReactNode;
}) {
  return (
    <g className={isActive(activeGuide, hand, finger) ? "hand-finger hand-finger-active" : "hand-finger"}>
      {children}
      <title>{`${hand} hand ${finger} finger`}</title>
      <text className="hand-finger-label" x={labelX} y="195" textAnchor="middle">
        {finger}
      </text>
    </g>
  );
}

export function HandFingerGuide({ activeGuide }: HandFingerGuideProps) {
  return (
    <div className="hand-guide" aria-label="Touch typing finger guide">
      <div className="hand-guide-heading">
        <span>Finger guide</span>
        {activeGuide && <strong>{activeGuide.hand} {activeGuide.finger} finger</strong>}
      </div>
      <svg viewBox="0 0 640 230" role="img" aria-labelledby="hand-guide-title hand-guide-description">
        <title id="hand-guide-title">Left and right hand finger guide</title>
        <desc id="hand-guide-description">Each finger is labeled and the finger needed for the next key is highlighted.</desc>

        <g aria-label="Left hand">
          <rect className="hand-palm" x="55" y="94" width="170" height="80" rx="42" />
          <FingerPart activeGuide={activeGuide} hand="Left" finger="Pinky" labelX={74}>
            <rect x="62" y="76" width="25" height="70" rx="12" />
          </FingerPart>
          <FingerPart activeGuide={activeGuide} hand="Left" finger="Ring" labelX={105}>
            <rect x="92" y="48" width="27" height="98" rx="13" />
          </FingerPart>
          <FingerPart activeGuide={activeGuide} hand="Left" finger="Middle" labelX={139}>
            <rect x="125" y="34" width="28" height="112" rx="14" />
          </FingerPart>
          <FingerPart activeGuide={activeGuide} hand="Left" finger="Index" labelX={173}>
            <rect x="159" y="48" width="28" height="98" rx="14" />
          </FingerPart>
          <FingerPart activeGuide={activeGuide} hand="Left" finger="Thumb" labelX={215}>
            <path d="M185 135 C215 112 240 118 250 139 C258 156 243 170 226 160 L185 147 Z" />
          </FingerPart>
          <text className="hand-title" x="140" y="226" textAnchor="middle">LEFT HAND</text>
        </g>

        <g aria-label="Right hand">
          <rect className="hand-palm" x="415" y="94" width="170" height="80" rx="42" />
          <FingerPart activeGuide={activeGuide} hand="Right" finger="Pinky" labelX={566}>
            <rect x="553" y="76" width="25" height="70" rx="12" />
          </FingerPart>
          <FingerPart activeGuide={activeGuide} hand="Right" finger="Ring" labelX={534}>
            <rect x="521" y="48" width="27" height="98" rx="13" />
          </FingerPart>
          <FingerPart activeGuide={activeGuide} hand="Right" finger="Middle" labelX={501}>
            <rect x="487" y="34" width="28" height="112" rx="14" />
          </FingerPart>
          <FingerPart activeGuide={activeGuide} hand="Right" finger="Index" labelX={467}>
            <rect x="453" y="48" width="28" height="98" rx="14" />
          </FingerPart>
          <FingerPart activeGuide={activeGuide} hand="Right" finger="Thumb" labelX={425}>
            <path d="M455 135 C425 112 400 118 390 139 C382 156 397 170 414 160 L455 147 Z" />
          </FingerPart>
          <text className="hand-title" x="500" y="226" textAnchor="middle">RIGHT HAND</text>
        </g>
      </svg>
    </div>
  );
}
