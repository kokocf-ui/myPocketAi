// Final, narrowly scoped mobile layout contract. Do not alter the global dock,
// generic maths editor, lesson data or other dialog families.
export const EDUCATION_MOBILE_CONTAINMENT_STYLE=String.raw`
/* A single scroll owner for the AI tutor. Flex compression used to collapse
   the textarea while its injected input aids and buttons overflowed it. */
dialog.language-tutor-dialog[open]{height:calc(100dvh - 24px)!important;max-height:calc(100dvh - 24px)!important;overflow:hidden!important;padding:12px!important;gap:10px!important;background:linear-gradient(150deg,#12374a,#081c2d)!important;color:#e6f7fc!important;border-color:#58a9bd!important}
dialog.language-tutor-dialog[open]>.education-theory-head{position:static!important;flex:0 0 auto!important;padding:0 0 8px!important;gap:8px!important;background:transparent!important;align-items:center!important}
.language-tutor-dialog .education-theory-head>h2{margin:0!important;line-height:1.25!important}
.language-tutor-dialog .language-tutor-body{box-sizing:border-box;display:flex;flex-direction:column;gap:12px;flex:1 1 auto;min-height:0;min-width:0;overflow-y:auto;overflow-x:hidden;overscroll-behavior:contain;touch-action:pan-y;padding:0 3px 18px;scroll-padding:12px}
.language-tutor-dialog .language-tutor-body>*{flex-shrink:0!important;min-width:0;max-width:100%}
.language-tutor-dialog .science-result-text{height:auto!important;max-height:none!important;overflow:visible!important;margin:0!important;padding:0!important;white-space:pre-wrap;overflow-wrap:anywhere}
.language-tutor-dialog #languageTutorInput{box-sizing:border-box;display:block!important;position:static!important;width:100%!important;min-height:104px!important;height:104px!important;max-height:none!important;margin:0!important;padding:10px!important;font-size:16px!important;resize:vertical;flex:0 0 auto!important}
.language-tutor-dialog .language-tutor-actions{display:grid;grid-template-columns:minmax(0,1fr);gap:10px}
.language-tutor-dialog button{box-sizing:border-box;position:static!important;min-height:44px!important;height:auto!important;min-width:0!important;max-width:100%!important;margin:0!important;padding:10px!important;font-size:15px!important;line-height:1.25!important;white-space:normal!important;touch-action:manipulation;transform:none!important}
/* Input aids always consume their own line, after the textarea. No overlap
   with later actions when a keyboard opens or font size increases. */
.edu-lesson-workspace{flex:0 0 auto!important;min-height:min-content!important;overflow:visible!important}
.edu-lesson-workspace>*,.edu-input-tools,.edu-input-tools>div{flex-shrink:0!important}
.edu-input-tools{position:static!important;clear:both;isolation:isolate;margin:8px 0;max-width:100%;height:auto!important;min-height:min-content!important}
.edu-input-tools button{position:static!important;margin:0!important;transform:none!important}
/* National mathematics activities and work area share ONE bounded scroll
   panel. Neither the action list nor the workspace may shrink to zero. */
#view-module.learning-math.math-choice-stage .math-national-panel:has(>.edu-lesson-workspace){overflow-y:auto!important;overflow-x:hidden!important;min-height:0!important;flex:1 1 auto!important;justify-content:flex-start!important;overscroll-behavior:contain;touch-action:pan-y;padding-bottom:24px!important;scroll-padding-bottom:24px!important}
#view-module.learning-math .math-national-panel:has(>.edu-lesson-workspace)>*{flex-shrink:0!important}
#view-module.learning-math .math-national-panel:has(>.edu-lesson-workspace)>.math-national-actions{flex:0 0 auto!important;display:grid!important;grid-template-columns:repeat(2,minmax(0,1fr))!important;gap:10px!important;overflow:visible!important;height:auto!important;max-height:none!important;min-height:0!important;align-content:start!important}
#view-module.learning-math .math-national-panel>.math-national-actions>.math-national-action,
#view-module.learning-math .math-national-panel>.math-national-actions>.math-national-next{position:static!important;height:auto!important;min-height:64px!important;margin:0!important;font-size:14px!important;white-space:normal!important}
#view-module.learning-math .math-national-panel>.math-national-output:empty{display:none!important}
.edu-lesson-workspace textarea,.edu-lesson-workspace select{flex:0 0 auto!important;position:static!important;margin:0!important}
@media(max-height:520px){dialog.language-tutor-dialog[open]{padding:8px!important;gap:6px!important}.language-tutor-dialog .education-theory-head>h2{font-size:16px!important}}
`;
