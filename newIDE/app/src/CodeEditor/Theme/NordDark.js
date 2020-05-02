const themeData = {
  base: 'vs-dark',
  inherit: true,
  rules: [
    {
      foreground: '616e88',
      token: 'comment',
    },
    {
      foreground: '616e88',
      fontStyle: 'bold',
      token: 'comment.block.preprocessor',
    },
    {
      foreground: "81a1c1",
      token: 'comment.block.documentation',
    },
    {
      foreground: "d8dee9",
      background: "bf616a",
      token: 'invalid.illegal',
    },
    {
      foreground: '81a1c1',
      token: 'keyword',
    },
    {
      foreground: '81a1c1',
      token: 'storage',
    },
    {
      foreground: '81a1c1',
      token: 'keyword.operator',
    },
    {
      foreground: '81a1c1',
      token: 'constant.language',
    },
    {
      foreground: '81a1c1',
      token: 'support.constant',
    },
    {
      foreground: '8fbcbb',
      token: 'storage.type',
    },
    {
      foreground: '8fBcbb',
      token: 'entity.other.attribute-name',
    },
    {
      foreground: 'd8dee9',
      token: 'variable.other',
    },
    {
      foreground: 'd8dee9',
      token: 'variable.language',
    },
    {
      foreground: '8fbcbb',
      token: 'entity.name.type',
    },
    {
      foreground: '8fbcbb',
      fontStyle: 'bold',
      token: 'entity.other.inherited-class',
    },
    {
      foreground: '8fbcbb',
      token: 'support.class',
    },
    {
      foreground: '8fbcbb',
      token: 'variable.other.constant',
    },
    {
      foreground: '88c0d0',
      token: 'entity.name.function',
    },
    {
      foreground: '88c0d0',
      token: 'support.function',
    },
    {
      foreground: '88c0d0',
      token: 'entity.name.section',
    },
    {
      foreground: '5e81ac',
      token: 'entity.name.tag',
    },
    {
      foreground: 'd8dee9',
      token: 'variable.parameter',
    },
    {
      foreground: 'd8dee9',
      token: 'support.variable',
    },
    {
      foreground: 'b48ead',
      token: 'constant.numeric',
    },
    {
      foreground: 'b48ead',
      token: 'constant.other',
    },
    {
      foreground: 'a3be8c',
      token: 'string - string source',
    },
    {
      foreground: 'ebcb8b',
      token: 'constant.character',
    },
    {
      foreground: 'ebcb8b',
      token: 'string.regexp',
    },
    {
      foreground: 'd8dee9',
      fontStyle: 'bold',
      token: 'constant.other.symbol',
    },
    {
      fontground: 'eceff4',
      token: 'punctuation',
    },
    {
      foreground: 'bf616a',
      token: 'markup.deleted',
    },
    {
      fontStyle: 'italic',
      token: 'markup.italic',
    },
    {
      foreground: '88c0d0',
      token: 'markup.heading',
    },
    {
      foreground: 'a3be8c',
      token: 'markup.inserted',
    },
    {
      fontStyle: 'bold',
      token: 'markup.bold',
    },
    {
      fontStyle: 'underline',
      token: 'markup.underline',
    },
    {
      foreground: '8fbcbb',
      token: 'meta.diff.range',
    },
    {
      foreground: '8fbcbb',
      token: 'meta.diff.header.from-file',
    },
  ],
  colors: {
    "editorActiveLineNumber.foreground": "#d8dee9",
    "editorCursor.foreground": "#d8dee9",
    "editorHint.border": "#ebcb8b",
    "editorHint.foreground": "#ebcb8b",
    "editorIndentGuide.background": "#434c5e",
    "editorIndentGuide.activeBackground": "#4c566a",
    "editorLineNumber.foreground": "#4c566a",
    "editorLineNumber.activeForeground": "#d8dee9",
    "editorWhitespace.foreground": "#4c566a",
    "editorWidget.background": "#2e3440",
    "editorWidget.border": "#3b4252",
    "editor.background": "#2e3440",
    "editor.foreground": "#d8dee9",
    "editor.hoverHighlightBackground": "#3b4252",
    "editor.findMatchBackground": "#88c0d0",
    "editor.findMatchHighlightBackground": "#88c0d0",
    "editor.findRangeHighlightBackground": "#88c0d0",
    "editor.lineHighlightBackground": "#3b4252",
    "editor.lineHighlightBorder": "#3b4252",
    "editor.inactiveSelectionBackground": "#434c5e",
    "editor.selectionBackground": "#434c5e",
    "editor.selectionHighlightBackground": "#434c5e",
    "editor.rangeHighlightBackground": "#434c5e",
    "editor.wordHighlightBackground": "#81a1c1",
    "editor.wordHighlightStrongBackground": "#81a1c1",
    "editorError.foreground": "#bf616a",
    "editorError.border": "#bf616a",
    "editorWarning.foreground": "#ebcb8b",
    "editorWarning.border": "#ebcb8b",
    "editorBracketMatch.background": "#2e3440",
    "editorBracketMatch.border": "#88c0d0",
    "editorCodeLens.foreground": "#4c566a",
    "editorGroup.background": "#2e3440",
    "editorGroup.border": "#3b4252",
    "editorGroup.dropBackground": "#3b4252",
    "editorGroupHeader.noTabsBackground": "#2e3440",
    "editorGroupHeader.tabsBackground": "#2e3440",
    "editorGroupHeader.tabsBorder": "#3b4252",
    "editorGutter.background": "#2e3440",
    "editorGutter.modifiedBackground": "#ebcb8b",
    "editorGutter.addedBackground": "#a3be8c",
    "editorGutter.deletedBackground": "#bf616a",
    "editorHoverWidget.background": "#3b4252",
    "editorHoverWidget.border": "#3b4252",
    "editorLink.activeForeground": "#88c0d0",
    "editorMarkerNavigation.background": "#5e81ac",
    "editorMarkerNavigationError.background": "#bf616a",
    "editorMarkerNavigationWarning.background": "#ebcb8b",
    "editorOverviewRuler.border": "#3b4252",
    "editorOverviewRuler.currentContentForeground": "#3b4252",
    "editorOverviewRuler.incomingContentForeground": "#3b4252",
    "editorOverviewRuler.findMatchForeground": "#88c0d0",
    "editorOverviewRuler.rangeHighlightForeground": "#88c0d0",
    "editorOverviewRuler.selectionHighlightForeground": "#88c0d0",
    "editorOverviewRuler.wordHighlightForeground": "#88c0d0",
    "editorOverviewRuler.wordHighlightStrongForeground": "#88c0d0",
    "editorOverviewRuler.modifiedForeground": "#ebcb8b",
    "editorOverviewRuler.addedForeground": "#a3be8c",
    "editorOverviewRuler.deletedForeground": "#bf616a",
    "editorOverviewRuler.errorForeground": "#bf616a",
    "editorOverviewRuler.warningForeground": "#ebcb8b",
    "editorOverviewRuler.infoForeground": "#81a1c1",
    "editorRuler.foreground": "#434c5e",
    "editorSuggestWidget.background": "#2e3440",
    "editorSuggestWidget.border": "#3b4252",
    "editorSuggestWidget.foreground": "#d8dee9",
    "editorSuggestWidget.highlightForeground": "#88c0d0",
    "editorSuggestWidget.selectedBackground": "#434c5e",
  },
};

export default {
  name: 'Nord-Dark',
  themeName: 'nord-dark',
  themeData,
};
