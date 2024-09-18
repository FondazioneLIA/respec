// @ts-check
// Module aom/conformance
// Handle the conformance section properly.
import { getIntlData, htmlJoinAnd, showWarning } from "../core/utils.js";
import { html } from "../core/import-maps.js";
import { renderInlineCitation } from "../core/render-biblio.js";
import { rfc2119Usage } from "../core/inlines.js";
export const name = "aom/conformance";

const localizationStrings = {
  en: {
    conformance: "Conformance",
    normativity:
      "As well as sections marked as non-normative, all authoring guidelines, " +
      "diagrams, examples, and notes in this specification are non-normative. " +
      "Everything else in this specification is normative.",
    keywordInterpretation(keywords, plural) {
      return html`<p>
        The key word${plural ? "s" : ""} ${keywords} in this document
        ${plural ? "are" : "is"} to be interpreted as described in
        <a href="https://datatracker.ietf.org/doc/html/bcp14">BCP 14</a>
        ${renderInlineCitation("RFC2119")} ${renderInlineCitation("RFC8174")}
        when, and only when, they appear in all capitals, as shown here.
      </p>`;
    },
  },
  it: {
    conformance: "Conformità",
    normativity:
      "Oltre alle sezioni indicate come non normative, tutte le linee guida " +
      "per gli autori, i diagrammi, gli esempi, e le note in questa " +
      "specifica sono non normative. Tutto il resto in questa specifica " +
      "è normativo.",
    keywordInterpretation(keywords, plural) {
      return html`<p>
        ${plural ? "Le" : "La"}
        parol${plural ? "e" : "a"} chiave ${keywords} in questo documento
        ${plural ? "sono" : "è"} da interpretare come descritto nel
        <a href="https://datatracker.ietf.org/doc/html/bcp14">BCP 14</a>
        ${renderInlineCitation("RFC2119")} ${renderInlineCitation("RFC8174")}
        quando, e solo quando, ${plural ? "appaiono" : "appare"} con tutte
        maiuscole, come mostrato qui.
      </p>`;
    },
  },
};
const l10n = getIntlData(localizationStrings);

/**
 * @param {Element} conformance
 * @param {*} conf
 */
function processConformance(conformance, conf) {
  const terms = [...Object.keys(rfc2119Usage)];
  // Add RFC2119 to bibliography
  if (terms.length) {
    conf.normativeReferences.add("RFC2119");
    conf.normativeReferences.add("RFC8174");
  }
  // Put in the 2119 clause and reference
  const keywords = htmlJoinAnd(
    terms.sort(),
    item => html`<em class="rfc2119">${item}</em>`
  );
  const plural = terms.length > 1;
  const content = html`
    <h1>${l10n.conformance}</h1>
    <p>${l10n.normativity}</p>
    ${terms.length ? l10n.keywordInterpretation(keywords, plural) : null}
  `;
  conformance.prepend(...content.childNodes);
}

export function run(conf) {
  const conformance = document.querySelector("section#conformance");
  if (conformance && !conformance.classList.contains("override")) {
    processConformance(conformance, conf);
  }
  // Warn when there are RFC2119/RFC8174 keywords, but not conformance section
  if (!conformance && Object.keys(rfc2119Usage).length) {
    const msg = `Document uses RFC2119 keywords but lacks a conformance section.`;
    const hint = 'Please add a `<section id="conformance">`.';
    showWarning(msg, name, { hint });
  }
}
