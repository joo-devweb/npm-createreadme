// © Nathan 2025

export enum Status {
  Verifying = 'VERIFYING',
  AwaitingUpload = 'AWAITING_UPLOAD',
  Analyzing = 'ANALYZING',
  ReadyToPublish = 'READY_TO_PUBLISH',
  Error = 'ERROR',
}

export interface PreflightCheck {
    hasName: boolean;
    hasVersion: boolean;
    hasMain: boolean;
    hasLicense: boolean;
    hasRepository: boolean;
    hasDescription: boolean;
}

export interface ExtractedPackageFiles {
  packageName: string;
  packageVersion: string;
  packageJsonContent: string;
  mainFileContent: string;
  mainFilePath: string;
  isScoped: boolean;
  preflightCheck: PreflightCheck;
}

export interface AiReadmeResult {
    readmeContent: string;
}