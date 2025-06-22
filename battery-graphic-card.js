
import { LitElement, html, css } from 'https://unpkg.com/lit-element?module';

class BatteryGraphicCard extends LitElement {
  static get properties() {
    return {
      hass: {},
      config: {}
    };
  }

  static get styles() {
    return css`
      .container {
        display: flex;
        flex-direction: column;
        align-items: center;
        padding: 16px;
      }
      .battery {
        width: 60px;
        height: 120px;
        border: 4px solid white;
        border-radius: 6px;
        position: relative;
        background: #111;
        overflow: hidden;
      }
      .cap {
        position: absolute;
        top: -10px;
        left: 20px;
        width: 20px;
        height: 10px;
        background: white;
        border-radius: 2px;
      }
      .fill {
        position: absolute;
        bottom: 0;
        left: 0;
        width: 100%;
        transition: height 0.5s ease;
      }
      .icon {
        position: absolute;
        top: 40px;
        left: 18px;
        font-size: 24px;
        color: white;
      }
      .percentage {
        margin-top: 8px;
        color: white;
        font-size: 18px;
      }
    `;
  }

  setConfig(config) {
    if (!config.entity) {
      throw new Error("You need to define an entity");
    }
    this.config = config;
  }

  render() {
    const stateObj = this.hass.states[this.config.entity];
    if (!stateObj) {
      return html`<ha-card>Battery sensor not found: ${this.config.entity}</ha-card>`;
    }

    const level = parseInt(stateObj.state, 10);
    const current = parseFloat(stateObj.attributes.current || 0);
    const charging = current >= 0;

    let color = "gray";
    if (charging) {
      color = "limegreen";
    } else if (level > 60) {
      color = "limegreen";
    } else if (level > 30) {
      color = "orange";
    } else {
      color = "red";
    }

    return html`
      <ha-card>
        <div class="container">
          <div class="battery">
            <div class="cap"></div>
            <div class="fill" style="height: ${Math.min(level, 100)}%; background: ${color};"></div>
            ${charging ? html`<div class="icon">⚡</div>` : ""}
          </div>
          <div class="percentage">${level}%</div>
        </div>
      </ha-card>
    `;
  }

  getCardSize() {
    return 3;
  }

  static getConfigElement() {
    return document.createElement("hui-entity-card-editor");
  }

  static getStubConfig(hass, entities) {
    const battery = entities.find(e => e.includes("battery")) || "sensor.bateria";
    return { entity: battery };
  }
}

customElements.define("battery-graphic-card", BatteryGraphicCard);

window.customCards = window.customCards || [];
window.customCards.push({
  type: "battery-graphic-card",
  name: "Battery Graphic Card",
  description: "Wizualna karta poziomu baterii z graficznym wskaźnikiem."
});
