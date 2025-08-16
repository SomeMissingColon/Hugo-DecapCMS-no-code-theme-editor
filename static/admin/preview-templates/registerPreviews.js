import UniversalPreview from "./UniversalPreview.js";

/* Register the universal theme preview */
CMS.registerPreviewTemplate("theme", UniversalPreview);

/* Register preview styles for better integration */
CMS.registerPreviewStyle('/css/main.css');