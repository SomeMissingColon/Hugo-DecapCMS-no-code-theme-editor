import UniversalPreview from "./UniversalPreview.js";
import HomePreview from "./HomePreview.js";
import PagePreview from "./PagePreview.js";
import BlogPreview from "./BlogPreview.js";
import ConfigPreview from "./ConfigPreview.js";

/* Register the universal theme preview */
CMS.registerPreviewTemplate("theme", UniversalPreview);

/* Register page previews for each page collection */
CMS.registerPreviewTemplate("home", HomePreview);
CMS.registerPreviewTemplate("about", PagePreview);
CMS.registerPreviewTemplate("services", PagePreview);
CMS.registerPreviewTemplate("contact", PagePreview);

/* Register blog post preview */
CMS.registerPreviewTemplate("blog", BlogPreview);

/* Register config preview */
CMS.registerPreviewTemplate("config", ConfigPreview);

/* Register preview styles for better integration */
CMS.registerPreviewStyle('/css/main.css');