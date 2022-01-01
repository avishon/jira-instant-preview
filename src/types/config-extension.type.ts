export interface ExtensionConfig {
  cacheMaxKb: number;
  hideDialogOnPageContentLoaded: boolean;
  hideDialogOnMouseMove: boolean;
  showDialogForCacheOnly: boolean;
  showCommentsAtTop: boolean;
  commentOrderNewFirst: boolean;
  themeColor: 'default' | 'dark' | 'lightPurple' | 'lightGreen';
}
