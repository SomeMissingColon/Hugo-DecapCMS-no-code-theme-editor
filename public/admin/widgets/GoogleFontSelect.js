/* GoogleFontSelect — Google Fonts picker for Datazentrik CMS
   ---------------------------------------------------------
   • Zero React imports • Works with module loading
*/

const { createClass, h } = window;
const FONTS_JSON_URL = "/admin/google-fonts.json";
const FALLBACKS = [
  { family: "DM Sans" }, 
  { family: "Inter" }, 
  { family: "Roboto" }, 
  { family: "Open Sans" },
  { family: "Lato" },
  { family: "Montserrat" },
  { family: "Poppins" },
  { family: "Source Sans Pro" },
  { family: "IBM Plex Sans" }
];

/* ----------------------- Control --------------------------------------- */
const GoogleFontControl = createClass({
  getInitialState() {
    return { fonts: FALLBACKS, filter: "", loading: true };
  },

  componentDidMount() {
    fetch(FONTS_JSON_URL)
      .then((r) => r.json())
      .then((data) => {
        // Use all fonts from the local JSON file
        this.setState({ fonts: data.items || FALLBACKS, loading: false });
      })
      .catch(() => this.setState({ loading: false })); // keep FALLBACKS
  },

  handleChange(e) { 
    this.props.onChange(e.target.value); 
  },
  
  handleFilter(e) { 
    this.setState({ filter: e.target.value }); 
  },

  filtered() {
    const f = this.state.filter.toLowerCase();
    return f
      ? this.state.fonts.filter((x) => x.family.toLowerCase().includes(f))
      : this.state.fonts;
  },

  render() {
    const value = this.props.value || "";
    return h(
      "div",
      { style: { fontFamily: "sans-serif" } },
      [
        h("input", {
          type: "text",
          placeholder: "Search fonts…",
          value: this.state.filter,
          onInput: this.handleFilter,
          style: { 
            width: "100%", 
            marginBottom: ".5rem",
            padding: "8px",
            border: "1px solid #ddd",
            borderRadius: "4px"
          },
        }),
        this.state.loading
          ? h("div", { style: { padding: "1rem", textAlign: "center" } }, "Loading fonts…")
          : h(
              "select",
              {
                value,
                onChange: this.handleChange,
                size: 8,
                style: { 
                  width: "100%", 
                  fontFamily: value || "inherit",
                  padding: "4px",
                  border: "1px solid #ddd",
                  borderRadius: "4px"
                },
              },
              this.filtered().map((f) =>
                h(
                  "option",
                  {
                    key: f.family,
                    value: f.family,
                    style: { 
                      fontFamily: `'${f.family}', sans-serif`,
                      padding: "8px"
                    },
                  },
                  f.family
                )
              )
            ),
      ]
    );
  },
});

/* ----------------------- Preview -------------------------------------- */
const GoogleFontPreview = createClass({
  render() {
    return h(
      "div",
      { style: { padding: "1rem", border: "1px solid #eee", borderRadius: "4px", backgroundColor: "#f9f9f9" } },
      [
        h(
          "p",
          {
            style: {
              fontFamily: `'${this.props.value}', sans-serif`,
              fontSize: "1.5rem",
              margin: "0 0 0.5rem 0",
              fontWeight: "600",
            },
          },
          this.props.value || "Font Preview"
        ),
        h(
          "p",
          {
            style: {
              fontFamily: `'${this.props.value}', sans-serif`,
              fontSize: "1rem",
              margin: 0,
              color: "#666",
            },
          },
          "The quick brown fox jumps over the lazy dog."
        )
      ]
    );
  },
});

/* ----------------------- Register ------------------------------------- */
CMS.registerWidget("googleFontSelect", GoogleFontControl, GoogleFontPreview);