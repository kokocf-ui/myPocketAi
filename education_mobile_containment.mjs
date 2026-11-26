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
/* Topics are menus only; work and results have their own windows. */
.edu-workspace-open,.edu-year-workspace-open{box-sizing:border-box!important;display:block!important;width:100%!important;flex:0 0 auto!important;min-height:52px!important;margin:4px 0 10px!important;padding:10px!important;white-space:normal!important;font-size:16px!important;background:#19536a!important;color:#effcff!important;border:1px solid #71c9d9!important;border-radius:12px!important}
dialog.edu-workspace-dialog[open]{box-sizing:border-box!important;display:flex!important;flex-direction:column!important;position:fixed!important;inset:0!important;margin:auto!important;width:min(96vw,800px)!important;max-width:calc(100vw - 16px)!important;height:calc(100dvh - 24px)!important;max-height:calc(100dvh - 24px)!important;overflow:hidden!important;padding:12px!important;gap:8px!important;background:#102d40!important;color:#e6f7fc!important}
.edu-workspace-dialog>.education-theory-head{position:static!important;flex:0 0 auto!important;display:flex!important;justify-content:space-between!important;gap:8px!important}
.edu-workspace-dialog h2{font-size:20px!important;margin:0!important}
.edu-workspace-body{flex:1 1 auto!important;min-height:0!important;min-width:0!important;overflow-y:auto!important;overflow-x:hidden!important;overscroll-behavior:contain;touch-action:pan-y;padding:0 2px 16px!important}
.edu-workspace-dialog .edu-lesson-workspace{margin:0!important;padding:8px!important}
.edu-workspace-dialog textarea{display:block!important;height:100px!important;min-height:100px!important;max-height:200px!important;padding:10px!important;line-height:1.4!important}
.edu-workspace-dialog button,.edu-workspace-dialog select{position:static!important;box-sizing:border-box!important;min-height:44px!important;height:auto!important;min-width:0!important;max-width:100%!important;margin:0!important;padding:10px!important;font-size:15px!important;white-space:normal!important;transform:none!important}
.edu-workspace-dialog [data-workspace-result]{display:none!important}
#view-module.learning-math .math-national-panel>.math-national-actions{display:grid!important;grid-template-columns:repeat(2,minmax(0,1fr))!important;gap:10px!important;flex:0 0 auto!important;overflow:visible!important;max-height:none!important}
#view-module.learning-math .math-national-panel>.math-national-actions>button{height:auto!important;min-height:56px!important;white-space:normal!important;font-size:14px!important}
/* Language navigation owns a single bounded panel above the fixed dock. */
main.page:has(#view-module.learning-languages.active){box-sizing:border-box!important;overflow:hidden!important;padding:6px 12px calc(105px + env(safe-area-inset-bottom,0px))!important}
#view-module.learning-languages.active{box-sizing:border-box!important;height:100%!important;max-height:100%!important;min-height:0!important;overflow:hidden!important;grid-template-rows:auto minmax(0,1fr)!important}
#view-module.learning-languages #moduleContent{height:100%!important;max-height:100%!important;min-height:0!important;flex:1 1 auto!important;overflow:hidden!important}
#view-module.learning-languages .science-choice-panel{height:100%!important;max-height:100%!important;min-height:0!important;flex:1 1 auto!important;overflow-y:auto!important;overflow-x:hidden!important;box-sizing:border-box!important;overscroll-behavior:contain!important;scroll-padding:12px!important;padding-bottom:24px!important}
#view-module.learning-languages .science-choice-panel>*{flex-shrink:0!important}
/* Column flex items inherited 100% basis and wrap, making horizontal columns.
   Block flow avoids that combination entirely, even with large device fonts. */
#view-module.learning-languages .foreign-stage-lesson .foreign-word-card{display:block!important;flex-wrap:nowrap!important;overflow:visible!important;height:auto!important;min-height:0!important;flex:0 0 auto!important}
#view-module.learning-languages .foreign-stage-lesson .foreign-word-card>*{box-sizing:border-box!important;position:static!important;float:none!important;flex:none!important;max-width:100%!important;min-width:0!important;width:100%!important;margin:0 0 10px!important;overflow-wrap:anywhere!important}
#view-module.learning-languages .foreign-stage-lesson .foreign-original{display:block!important;line-height:1.3!important}
#view-module.learning-languages .foreign-stage-lesson .foreign-phonetic[hidden]{display:none!important}
.foreign-resource-dialog .foreign-resource-content{display:block!important}
.foreign-resource-dialog .foreign-resource-content>*{box-sizing:border-box!important;position:static!important;float:none!important;min-width:0!important;max-width:100%!important;flex:none!important}
.foreign-resource-dialog .foreign-resource-content input,.foreign-resource-dialog .foreign-resource-content select{display:block!important;position:static!important;inset:auto!important;transform:none!important;width:100%!important;min-height:48px!important;height:48px!important;margin:12px 0!important;padding:10px!important;line-height:1.4!important}
.foreign-resource-dialog .foreign-resource-info{display:block!important;margin:8px 0 14px!important}
.foreign-resource-dialog summary{position:static!important;min-height:44px!important;line-height:1.5!important;padding:8px!important;overflow-wrap:anywhere!important}
.foreign-resource-dialog .foreign-resource-entry{display:block!important;overflow-wrap:anywhere!important;min-width:0!important}
.foreign-resource-dialog table{table-layout:fixed!important}
.edu-lesson-workspace textarea,.edu-lesson-workspace select{flex:0 0 auto!important;position:static!important;margin:0!important}
@media(max-height:520px){dialog.language-tutor-dialog[open]{padding:8px!important;gap:6px!important}.language-tutor-dialog .education-theory-head>h2{font-size:16px!important}}
`;
