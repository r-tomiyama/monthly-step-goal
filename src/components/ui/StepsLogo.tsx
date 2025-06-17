import { SvgIcon, type SvgIconProps } from '@mui/material';

export const StepsLogo = (props: SvgIconProps) => {
  return (
    <SvgIcon {...props} viewBox="0 0 100 100">
      {/* 足跡のアイコン */}
      <g>
        {/* 左足 */}
        <ellipse
          cx="25"
          cy="30"
          rx="8"
          ry="12"
          fill="currentColor"
          opacity="0.8"
        />
        <ellipse
          cx="22"
          cy="45"
          rx="4"
          ry="6"
          fill="currentColor"
          opacity="0.8"
        />
        <ellipse
          cx="28"
          cy="45"
          rx="4"
          ry="6"
          fill="currentColor"
          opacity="0.8"
        />
        <ellipse
          cx="25"
          cy="55"
          rx="3"
          ry="4"
          fill="currentColor"
          opacity="0.8"
        />

        {/* 右足 */}
        <ellipse
          cx="50"
          cy="20"
          rx="8"
          ry="12"
          fill="currentColor"
          opacity="0.9"
        />
        <ellipse
          cx="47"
          cy="35"
          rx="4"
          ry="6"
          fill="currentColor"
          opacity="0.9"
        />
        <ellipse
          cx="53"
          cy="35"
          rx="4"
          ry="6"
          fill="currentColor"
          opacity="0.9"
        />
        <ellipse
          cx="50"
          cy="45"
          rx="3"
          ry="4"
          fill="currentColor"
          opacity="0.9"
        />

        {/* 左足（前） */}
        <ellipse cx="75" cy="40" rx="8" ry="12" fill="currentColor" />
        <ellipse cx="72" cy="55" rx="4" ry="6" fill="currentColor" />
        <ellipse cx="78" cy="55" rx="4" ry="6" fill="currentColor" />
        <ellipse cx="75" cy="65" rx="3" ry="4" fill="currentColor" />
      </g>

      {/* 歩数カウンターっぽい円弧 */}
      <path
        d="M 15 75 Q 50 85 85 75"
        stroke="currentColor"
        strokeWidth="3"
        fill="none"
        strokeDasharray="5,3"
        opacity="0.6"
      />

      {/* 数字のような装飾 */}
      <g opacity="0.4">
        <rect x="20" y="80" width="2" height="8" fill="currentColor" />
        <rect x="25" y="80" width="2" height="8" fill="currentColor" />
        <rect x="30" y="80" width="2" height="8" fill="currentColor" />
        <rect x="35" y="82" width="2" height="4" fill="currentColor" />
        <rect x="40" y="80" width="2" height="8" fill="currentColor" />
      </g>
    </SvgIcon>
  );
};
