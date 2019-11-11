import { PluginRepresentation } from '@edtr-io/core'
import { js2xml, Element as XmlElement } from 'xml-js'

/*
 * Type for the plugin state which can be converted with
 */
// TODO: Move the following types to @edtr-io/core
type PluginState = number | boolean | string

/*
 * Converts a plugin state into a XML string. With the function
 * `xmlToPluginState()` this string can be converted back into the same
 * plugin state.
 *
 * @param state Plugin state which shall be converted
 */
export function pluginStateToXml(state: PluginState): string {
  return js2xml({ elements: [pluginStateToXmlElement(state)] })
}

/*
 * Converts a plugin state into XML using the JSON representation of the
 * project `xml-js`.
 *
 * @param state Plugin state which shall be converted
 */
function pluginStateToXmlElement(state: PluginState): XmlElement {
  if (typeof state === 'number') {
    return xmlElement('number', undefined, [xmlText(String(state))])
  } else if (typeof state === 'boolean') {
    return xmlElement('boolean', undefined, [xmlText(String(state))])
  } else {
    return xmlElement('string', undefined, [xmlText(String(state))])
  }
}

/*
 * Helper function for creating an XML element in the JSON representation of the
 * package `xml-js`.
 *
 * @param tagName Tag name of the created XML element
 * @param attributes Attributes of the created XML element
 * @param children Children of the created XML element
 */
function xmlElement(
  tagName: string,
  attributes: { [key: string]: string } = {},
  children: XmlElement[] = []
) {
  return {
    type: 'element',
    name: tagName,
    attributes: attributes,
    elements: children
  }
}

/*
 * Helper function for creating a XML text node in the JSON representation of
 * the package `xml-js`.
 *
 * @param text Text value of the created text node
 */
function xmlText(text: string): XmlElement {
  return { type: 'text', text: text }
}
