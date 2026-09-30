export function SceneFallback() {
  return (
    <svg
      className="scene-fallback"
      viewBox="0 0 1400 430"
      preserveAspectRatio="xMidYMax slice"
      aria-hidden="true"
    >
      <path fill="#233e51" d="M0 250H1400V430H0z" />
      <path
        fill="#667386"
        d="M0 225V185H80V160H140V205H210V150H270V175H340V210H1090V185H1160V155H1210V195H1320V160H1400V260H0z"
      />
      <g fill="#89909b" stroke="#a1a9b5" strokeWidth="5">
        <path d="M420 280V100H470V70H530V100H580V280H535V215Q500 170 465 215V280z" />
        <path d="M820 280V100H870V70H930V100H980V280H935V215Q900 170 865 215V280z" />
      </g>
      <g fill="#6c8587">
        <path d="M410 100L443 45L479 100zM523 100L556 45L590 100zM810 100L843 45L879 100zM923 100L956 45L990 100z" />
      </g>
      <g fill="none" stroke="#83a6af">
        <path strokeWidth="14" d="M0 281H1400M565 139H835" />
        <path
          strokeWidth="6"
          d="M0 277Q230 270 435 120M970 120Q1170 270 1400 277"
        />
      </g>
      <g stroke="#e9e3d7" opacity=".5">
        <path d="M230 355h170m350 35h220m150-50h100M100 410h180" />
      </g>
    </svg>
  );
}
