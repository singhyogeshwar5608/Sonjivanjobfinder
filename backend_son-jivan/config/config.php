<?php
define('UPLOAD_DIR', __DIR__ . '/../uploads/');
define('DOCUMENT_UPLOAD_DIR', __DIR__ . '/../uploads/documents/');
define('MAX_FILE_SIZE', 5 * 1024 * 1024);
define('MAX_DOC_FILE_SIZE', 10 * 1024 * 1024);
define('ALLOWED_IMAGE_TYPES', ['image/jpeg', 'image/png', 'image/jpg', 'image/webp']);
define('ALLOWED_DOC_TYPES', [
    'application/pdf',
    'application/msword',
    'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
    'image/jpeg',
    'image/png',
    'image/jpg'
]);

define('JWT_SECRET', 'your_secret_key_change_in_production');
define('JWT_ALGORITHM', 'HS256');

define('CLOUDINARY_CLOUD_NAME', 'dtnuwjtt3');
define('CLOUDINARY_API_KEY', '637725233499797');
define('CLOUDINARY_API_SECRET', 'St0BcLottpcQdtRGz_aL54PM29s');
define('CLOUDINARY_UPLOAD_PRESET', 'son_jivan_jobs_preset');
define('CLOUDINARY_UPLOAD_FOLDER', 'job_finder/applicants');

define('DROPBOX_ACCESS_TOKEN', 'sl.u.AGQf_489JMdBnBua03B5FMn2sAKL9u-T3aCPShXRYKiWEzuRrB2r4XolIJqMW3mBFInA9UCR_nNjaCbTJ_Dri5Uk8thvHZUT74SWPSgmV-CjlpS1_RNIw2zGiH5jBBWNPbg1_M-ZVSDzgF_JrS0vrkoqajd6beA9Vv3h37ocdQE4YsJbfJ0fqMVAFe-XmAadazszTClbsGdvEziJ_Tb_kgJekNBDt8h5Pn7HEQcv0T58n12ktFjaSoyTjWNs2ARjBgso8EzZbao1KyB0ZRhlRghJVVGz465xsmbU288VfChWedXyveK8i6cyvY06U7QbZSftt3BHwYiQVJhqXZLTAe9w5VrT3RRU69jpe7FEyIpNaDh-utVlWcLCUR5V0WZ9zVm_ft46Ym-ghOtQukZovLiT_x5uPAkrbcXNvEh7K0ERdhvuyKkXBllci5RSYIEmLqVIfrybv0mFuq8Baeiv7O1A5vMgwNnTav-gIZOIgF6Tu8Mub_tV1v9MO3-IHCsGt4eXPsrTlA5RydE9IIhOaRd7fvxgvPPOq1Y09-zS_WkosAfFneIxGjqS3YNsIQ_OFi-UKpRC3YKELWA9dDrtdeynPPWsWZOWcPG-SDJccR50G5SM2TEBs9W1eQpaskcLLD_0BFPb37XmJHfnss4Hts66OB44YXVmgjIyVW9kvm4jQNsqVfdkPEIEIwMaXlwpNgB0vGpmivW_8rhsdejcEJit0kS4LQ5sf6x4ROmrO1fxGrZ4vGMYoFsCtf8OZsMH86_bsuiKct5LywuOVijsoxE7_JuDAfEm1kYwkFox6FWznjrHIG39kS5gij8wK14C7SsMJHSDoRHFjDzxF-O3Dq8A5_IaeH1L0No_R9LrHn86GzDBBhVd0b4xUyPJjAnj3hp9awOIht772F0MnPfst-uVXOXuqVWT_iTdMo2K305GVpVuI6Qv_65My6aX2k7gc2bOlMt-Lta3a-z8n6Q97sEwWpR7NexXEFnLwcgFdMlZamzqFsErL0bB-cjonHSTEDZLJn8FbSsnIqQ_Eyjf7D7iGQYkwjZudHV8LTG_10H34KPunlR-WizZbr3ERZxBv1kW_xwbOQvRUqo79ye81GQwCrFhe5aTwfmocKzrM_G9E4QrgzG__NhbD0774XB_8GnW5VZ3jRPI1jNL7jnN5djK5rRGlV2FiKY_V74bMa8MGguaUdfsezdeDIHzigQG3mUFNPTWb6AUkAgIjBC7YqUZp2Lr8ZxtlJ9fHPxEQQxcJuKetbSUTqxf9JZ6sFCELeuU6vz5S4Fz7LBB7cDdnAdFPSVi63nQa2muKSGdH7kTuuB86QQtW0iJFw36hPxRpX9EY3viqv_i9VuqETf1Co585Sbf9sLcTDSmGmU-aHMhyLr1edb15uTUVHWqdAtSVZmgM0F4ypYgZknhT2ujIr-nda1ojNU3sD1aZ0a4aEew3A');
define('DROPBOX_APP_KEY', 'f494t1vutrbhg19');
define('DROPBOX_APP_SECRET', 'v');
define('DROPBOX_REFRESH_TOKEN', ''); // Optional: set if you generate a refresh token
define('DROPBOX_UPLOAD_FOLDER', '/sonjivan_jobfinder');

if (!file_exists(UPLOAD_DIR)) {
    mkdir(UPLOAD_DIR, 0777, true);
}

if (!file_exists(DOCUMENT_UPLOAD_DIR)) {
    mkdir(DOCUMENT_UPLOAD_DIR, 0777, true);
}
