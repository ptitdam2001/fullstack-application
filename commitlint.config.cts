import type {UserConfig} from '@commitlint/types'; 
import {RuleConfigSeverity} from '@commitlint/types'; 


const Configuration: UserConfig = {
  extends: ["@commitlint/config-conventional"],
  // parserPreset: 'conventional-changelog-atom',
  /*
   * Resolve and load @commitlint/format from node_modules.
   * Referenced package must be installed
   */
  formatter: "@commitlint/format",
  rules: {
    'subject-case': [RuleConfigSeverity.Warning, 'always', ['sentence-case', 'start-case', 'pascal-case', 'upper-case']], 
  },
};

export default Configuration;
