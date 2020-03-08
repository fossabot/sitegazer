<script>
  //export let project;

  let projectName = "example.org";
  let pages = [
    {
      url: "https://example.org/example1",
      deviceType: "desktop",
      files: [
        {
          url: "https://example.org/example1",
          issues: [
            {
              pluginName: "Nu HTML Checker",
              message: "Consider adding a “lang” attribute to the “html” start tag to declare the language of this document.",
              line: 3,
              column: 26,
            }
          ]
        },
        {
          url: "https://example.org/js/example1.js",
          issues: [
            {
              pluginName: "Chrome Console",
              message: "Type Error: Something went wrong.",
              line: 3,
              column: 26,
            }
          ]
        }
      ]
    },
    {
      url: "https://example.org/example2",
      deviceType: "mobile",
      files: [
        {
          url: "https://example.org/example2",
          issues: [
            {
              pluginName: "Nu HTML Checker",
              message: "Consider adding a “lang” attribute to the “html” start tag to declare the language of this document.",
              line: 3,
              column: 26,
            }
          ]
        },
      ]
    },
  ];
</script>

<main class="errors">
  <h2>{projectName}</h2>
  <div>
    {#each pages as page}
      <div class="page">
        <div class="page-url">
          <h3>{page.url}</h3>
          <img
            src="/assets/vendor/fontawesome/{page.deviceType === "desktop" ? "desktop" : "mobile-alt"}.svg"
            alt=""
            decoding="async">
        </div>

        {#each page.files as file}
          {#each file.issues as issue}
            <div class="error">
              <div class="error-container-l1">
                <span class="error-msg">
                  <img src="/assets/vendor/fontawesome/exclamation-circle.svg" alt="Error" decoding="async">
                  <h4>{issue.message}</h4>
                </span>
                <span class="error-plugin-name">{issue.pluginName}</span>
              </div>
              <span>{file.url} {issue.line}:{issue.column}</span>
            </div>
          {/each}
        {/each}
      </div>
    {/each}
  </div>
</main>

<style>
  .page {
    background-color: var(--basecolor-lightest);
    margin-right: 20px;
    margin-bottom: 20px;
    padding: 12px;
  }
  .page:first-child {
    margin-top: 20px;
  }

  .page-url > h3 {
    display: inline;
    font-size: 1.15em;
  }
  .page-url > img {
    height: 1.15em;
    vertical-align: -0.175em;
  }

  .error {
    margin-top: 16px;
    margin-bottom: 16px;
    padding: 10px;
    background-color: var(--basecolor-light);
  }
  .error-container-l1 {
    display: flex;
    justify-content: space-between;
  }

  .error-msg > h4 {
    display: inline;
    font-size: 1em;
  }
  .error-msg > img {
    height: 1em;
    vertical-align: -0.13em;
  }

  .error-plugin-name {
    color: var(--basecolor-lightest);
    background-color: var(--basecolor-dark);
    border-radius: 16px;

    font-size: 0.8em;
    font-weight: 650;

    padding: 0.2em 0.5em 0.2em 0.5em;
  }
</style>
