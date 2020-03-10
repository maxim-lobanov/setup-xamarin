export const LatestVersionKeyword = 'latest';

export const WarningMessageMajorMinorVersions = [
    `It is recommended to specify only major and minor versions of tool (like '13' or '13.2').`,
    `Hosted VMs contain the latest patch & build version for each major & minor pair.`,
    `It means that version '13.2.1.4' can be replaced by '13.2.2.0' without any notice and your pipeline will start failing.`
].join(' ');
