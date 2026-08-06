/* @ds-bundle: {"format":4,"namespace":"AppleStyleDesignSystem_9d4645","components":[{"name":"ButtonDarkUtility","sourcePath":"components/buttons/ButtonDarkUtility.jsx"},{"name":"ButtonIconCircular","sourcePath":"components/buttons/ButtonIconCircular.jsx"},{"name":"ButtonPearlCapsule","sourcePath":"components/buttons/ButtonPearlCapsule.jsx"},{"name":"ButtonPrimary","sourcePath":"components/buttons/ButtonPrimary.jsx"},{"name":"ButtonSecondaryPill","sourcePath":"components/buttons/ButtonSecondaryPill.jsx"},{"name":"TextLink","sourcePath":"components/buttons/TextLink.jsx"},{"name":"TextLinkOnDark","sourcePath":"components/buttons/TextLinkOnDark.jsx"},{"name":"EnvironmentQuoteCard","sourcePath":"components/cards/EnvironmentQuoteCard.jsx"},{"name":"StoreUtilityCard","sourcePath":"components/cards/StoreUtilityCard.jsx"},{"name":"ConfiguratorOptionChip","sourcePath":"components/commerce/ConfiguratorOptionChip.jsx"},{"name":"FloatingStickyBar","sourcePath":"components/commerce/FloatingStickyBar.jsx"},{"name":"SearchInput","sourcePath":"components/forms/SearchInput.jsx"},{"name":"Footer","sourcePath":"components/navigation/Footer.jsx"},{"name":"GlobalNav","sourcePath":"components/navigation/GlobalNav.jsx"},{"name":"SubNavFrosted","sourcePath":"components/navigation/SubNavFrosted.jsx"},{"name":"ProductTile","sourcePath":"components/tiles/ProductTile.jsx"}],"sourceHashes":{"components/buttons/ButtonDarkUtility.jsx":"07a3038c0b52","components/buttons/ButtonIconCircular.jsx":"094faf6ce0ac","components/buttons/ButtonPearlCapsule.jsx":"bbbdc507dace","components/buttons/ButtonPrimary.jsx":"443eb91e36f7","components/buttons/ButtonSecondaryPill.jsx":"a69a1786659a","components/buttons/TextLink.jsx":"adf72a24443b","components/buttons/TextLinkOnDark.jsx":"6b8b60910955","components/cards/EnvironmentQuoteCard.jsx":"a56ab3243141","components/cards/StoreUtilityCard.jsx":"058613ab1e0e","components/commerce/ConfiguratorOptionChip.jsx":"162272a2d943","components/commerce/FloatingStickyBar.jsx":"8931384b4b65","components/forms/SearchInput.jsx":"6616c6f44e34","components/navigation/Footer.jsx":"be7db544ac9d","components/navigation/GlobalNav.jsx":"9310e5882a1c","components/navigation/SubNavFrosted.jsx":"7075abb58e78","components/tiles/ProductTile.jsx":"5e0aa182f168","ui_kits/marketing/Homepage.jsx":"656f9f982972","ui_kits/store/AccessoriesPage.jsx":"5c85106d05e6","ui_kits/store/BuyPage.jsx":"6cc1a0bdf7d9"},"inlinedExternals":[],"unexposedExports":[]} */

(() => {

const __ds_ns = (window.AppleStyleDesignSystem_9d4645 = window.AppleStyleDesignSystem_9d4645 || {});

const __ds_scope = {};

(__ds_ns.__errors = __ds_ns.__errors || []);

// components/buttons/ButtonDarkUtility.jsx
try { (() => {
const {
  useState
} = React;
function ButtonDarkUtility({
  children,
  onClick
}) {
  const [pressed, setPressed] = useState(false);
  return /*#__PURE__*/React.createElement("button", {
    onClick: onClick,
    onMouseDown: () => setPressed(true),
    onMouseUp: () => setPressed(false),
    onMouseLeave: () => setPressed(false),
    style: {
      background: 'var(--color-ink)',
      color: '#fff',
      border: 'none',
      borderRadius: 'var(--radius-sm)',
      padding: '8px 15px',
      fontFamily: 'var(--font-text)',
      fontSize: 'var(--type-button-utility-size)',
      letterSpacing: 'var(--type-button-utility-ls)',
      cursor: 'pointer',
      transform: pressed ? 'var(--press-scale)' : 'none',
      transition: 'transform .1s ease',
      whiteSpace: 'nowrap',
      display: 'inline-flex',
      alignItems: 'center'
    }
  }, children);
}
Object.assign(__ds_scope, { ButtonDarkUtility });
})(); } catch (e) { __ds_ns.__errors.push({ path: "components/buttons/ButtonDarkUtility.jsx", error: String((e && e.message) || e) }); }

// components/buttons/ButtonIconCircular.jsx
try { (() => {
function ButtonIconCircular({
  children,
  onClick,
  label
}) {
  return /*#__PURE__*/React.createElement("button", {
    onClick: onClick,
    "aria-label": label,
    style: {
      width: 44,
      height: 44,
      borderRadius: 'var(--radius-full)',
      border: 'none',
      background: 'rgba(210,210,215,.64)',
      color: 'var(--color-ink)',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      cursor: 'pointer'
    }
  }, children);
}
Object.assign(__ds_scope, { ButtonIconCircular });
})(); } catch (e) { __ds_ns.__errors.push({ path: "components/buttons/ButtonIconCircular.jsx", error: String((e && e.message) || e) }); }

// components/buttons/ButtonPearlCapsule.jsx
try { (() => {
function ButtonPearlCapsule({
  children,
  onClick
}) {
  return /*#__PURE__*/React.createElement("button", {
    onClick: onClick,
    style: {
      background: 'var(--color-surface-pearl)',
      color: 'var(--color-ink-muted-80)',
      border: '3px solid var(--color-divider-soft)',
      borderRadius: 'var(--radius-md)',
      padding: '8px 14px',
      fontFamily: 'var(--font-text)',
      fontSize: 'var(--type-caption-size)',
      cursor: 'pointer',
      whiteSpace: 'nowrap',
      display: 'inline-flex',
      alignItems: 'center'
    }
  }, children);
}
Object.assign(__ds_scope, { ButtonPearlCapsule });
})(); } catch (e) { __ds_ns.__errors.push({ path: "components/buttons/ButtonPearlCapsule.jsx", error: String((e && e.message) || e) }); }

// components/buttons/ButtonPrimary.jsx
try { (() => {
const {
  useState
} = React;
function ButtonPrimary({
  children,
  onClick,
  disabled,
  large
}) {
  const [pressed, setPressed] = useState(false);
  return /*#__PURE__*/React.createElement("button", {
    onClick: onClick,
    disabled: disabled,
    onMouseDown: () => setPressed(true),
    onMouseUp: () => setPressed(false),
    onMouseLeave: () => setPressed(false),
    style: {
      background: 'var(--color-primary)',
      color: '#fff',
      border: 'none',
      borderRadius: 'var(--radius-pill)',
      padding: large ? '14px 28px' : '11px 22px',
      fontFamily: 'var(--font-text)',
      fontSize: large ? 'var(--type-button-large-size)' : 'var(--type-body-size)',
      fontWeight: large ? 'var(--type-button-large-weight)' : 400,
      cursor: disabled ? 'default' : 'pointer',
      opacity: disabled ? 0.4 : 1,
      transform: pressed ? 'var(--press-scale)' : 'none',
      transition: 'transform .1s ease',
      outline: 'none',
      whiteSpace: 'nowrap',
      display: 'inline-flex',
      alignItems: 'center'
    },
    onFocus: e => {
      e.target.style.outline = '2px solid var(--color-primary-focus)';
    },
    onBlur: e => {
      e.target.style.outline = 'none';
    }
  }, children);
}
Object.assign(__ds_scope, { ButtonPrimary });
})(); } catch (e) { __ds_ns.__errors.push({ path: "components/buttons/ButtonPrimary.jsx", error: String((e && e.message) || e) }); }

// components/buttons/ButtonSecondaryPill.jsx
try { (() => {
function ButtonSecondaryPill({
  children,
  onClick
}) {
  return /*#__PURE__*/React.createElement("button", {
    onClick: onClick,
    style: {
      background: 'transparent',
      color: 'var(--color-primary)',
      border: '1px solid var(--color-primary)',
      borderRadius: 'var(--radius-pill)',
      padding: '11px 22px',
      fontFamily: 'var(--font-text)',
      fontSize: 'var(--type-body-size)',
      cursor: 'pointer',
      whiteSpace: 'nowrap',
      display: 'inline-flex',
      alignItems: 'center'
    }
  }, children);
}
Object.assign(__ds_scope, { ButtonSecondaryPill });
})(); } catch (e) { __ds_ns.__errors.push({ path: "components/buttons/ButtonSecondaryPill.jsx", error: String((e && e.message) || e) }); }

// components/buttons/TextLink.jsx
try { (() => {
function TextLink({
  children,
  href = '#',
  underline
}) {
  return /*#__PURE__*/React.createElement("a", {
    href: href,
    style: {
      color: 'var(--color-primary)',
      textDecoration: underline ? 'underline' : 'none',
      fontFamily: 'var(--font-text)'
    }
  }, children);
}
Object.assign(__ds_scope, { TextLink });
})(); } catch (e) { __ds_ns.__errors.push({ path: "components/buttons/TextLink.jsx", error: String((e && e.message) || e) }); }

// components/buttons/TextLinkOnDark.jsx
try { (() => {
function TextLinkOnDark({
  children,
  href = '#',
  underline
}) {
  return /*#__PURE__*/React.createElement("a", {
    href: href,
    style: {
      color: 'var(--color-primary-on-dark)',
      textDecoration: underline ? 'underline' : 'none',
      fontFamily: 'var(--font-text)'
    }
  }, children);
}
Object.assign(__ds_scope, { TextLinkOnDark });
})(); } catch (e) { __ds_ns.__errors.push({ path: "components/buttons/TextLinkOnDark.jsx", error: String((e && e.message) || e) }); }

// components/cards/EnvironmentQuoteCard.jsx
try { (() => {
function EnvironmentQuoteCard({
  eyebrow = 'Aperture 2030',
  title,
  cta
}) {
  return /*#__PURE__*/React.createElement("section", {
    style: {
      background: 'var(--color-surface-tile-1)',
      color: '#fff',
      padding: 'var(--space-section) 24px',
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      textAlign: 'center',
      gap: 20,
      fontFamily: 'var(--font-display)'
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      fontFamily: 'var(--font-text)',
      fontSize: 14,
      letterSpacing: 1,
      opacity: 0.8
    }
  }, eyebrow), /*#__PURE__*/React.createElement("h2", {
    style: {
      margin: 0,
      fontSize: 'var(--type-display-lg-size)',
      fontWeight: 'var(--type-display-lg-weight)',
      maxWidth: 700
    }
  }, title), cta);
}
Object.assign(__ds_scope, { EnvironmentQuoteCard });
})(); } catch (e) { __ds_ns.__errors.push({ path: "components/cards/EnvironmentQuoteCard.jsx", error: String((e && e.message) || e) }); }

// components/cards/StoreUtilityCard.jsx
try { (() => {
function StoreUtilityCard({
  image,
  name,
  price,
  cta = 'Learn more',
  onAction
}) {
  return /*#__PURE__*/React.createElement("div", {
    style: {
      background: 'var(--color-canvas)',
      border: '1px solid var(--color-hairline)',
      borderRadius: 'var(--radius-lg)',
      padding: 'var(--space-lg)',
      fontFamily: 'var(--font-text)',
      display: 'flex',
      flexDirection: 'column',
      gap: 8,
      width: 220
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      aspectRatio: '1/1',
      background: '#f0f0f0',
      borderRadius: 'var(--radius-sm)',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center'
    }
  }, image), /*#__PURE__*/React.createElement("div", {
    style: {
      fontSize: 'var(--type-body-strong-size)',
      fontWeight: 'var(--type-body-strong-weight)',
      color: 'var(--color-ink)'
    }
  }, name), /*#__PURE__*/React.createElement("div", {
    style: {
      fontSize: 'var(--type-body-size)',
      color: 'var(--color-ink)'
    }
  }, price), /*#__PURE__*/React.createElement("a", {
    onClick: onAction,
    style: {
      color: 'var(--color-primary)',
      fontSize: 'var(--type-caption-size)',
      cursor: 'pointer'
    }
  }, cta));
}
Object.assign(__ds_scope, { StoreUtilityCard });
})(); } catch (e) { __ds_ns.__errors.push({ path: "components/cards/StoreUtilityCard.jsx", error: String((e && e.message) || e) }); }

// components/commerce/ConfiguratorOptionChip.jsx
try { (() => {
function ConfiguratorOptionChip({
  thumbnail,
  label,
  priceDelta,
  selected,
  onClick
}) {
  return /*#__PURE__*/React.createElement("button", {
    onClick: onClick,
    style: {
      display: 'flex',
      alignItems: 'center',
      gap: 10,
      background: 'var(--color-canvas)',
      border: selected ? '2px solid var(--color-primary-focus)' : '1px solid var(--color-hairline)',
      borderRadius: 'var(--radius-pill)',
      padding: '12px 16px',
      fontFamily: 'var(--font-text)',
      cursor: 'pointer',
      textAlign: 'left',
      whiteSpace: 'nowrap'
    }
  }, thumbnail && /*#__PURE__*/React.createElement("div", {
    style: {
      width: 28,
      height: 28,
      borderRadius: 'var(--radius-full)',
      background: '#eee',
      flexShrink: 0
    }
  }, thumbnail), /*#__PURE__*/React.createElement("div", null, /*#__PURE__*/React.createElement("div", {
    style: {
      fontSize: 'var(--type-caption-size)',
      color: 'var(--color-ink)'
    }
  }, label), priceDelta && /*#__PURE__*/React.createElement("div", {
    style: {
      fontSize: 'var(--type-micro-legal-size)',
      color: 'var(--color-ink-muted-48)'
    }
  }, priceDelta)));
}
Object.assign(__ds_scope, { ConfiguratorOptionChip });
})(); } catch (e) { __ds_ns.__errors.push({ path: "components/commerce/ConfiguratorOptionChip.jsx", error: String((e && e.message) || e) }); }

// components/commerce/FloatingStickyBar.jsx
try { (() => {
function FloatingStickyBar({
  price,
  cta
}) {
  return /*#__PURE__*/React.createElement("div", {
    style: {
      position: 'sticky',
      bottom: 0,
      background: 'rgba(245,245,247,.8)',
      backdropFilter: 'var(--blur-frost)',
      WebkitBackdropFilter: 'var(--blur-frost)',
      height: 64,
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'space-between',
      padding: '12px 32px',
      fontFamily: 'var(--font-text)',
      borderTop: 'var(--border-hairline)'
    }
  }, /*#__PURE__*/React.createElement("span", {
    style: {
      fontSize: 'var(--type-body-size)',
      color: 'var(--color-ink)'
    }
  }, price), cta);
}
Object.assign(__ds_scope, { FloatingStickyBar });
})(); } catch (e) { __ds_ns.__errors.push({ path: "components/commerce/FloatingStickyBar.jsx", error: String((e && e.message) || e) }); }

// components/forms/SearchInput.jsx
try { (() => {
function SearchInput({
  value,
  onChange,
  placeholder = 'Search'
}) {
  return /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'flex',
      alignItems: 'center',
      gap: 8,
      height: 44,
      background: 'var(--color-canvas)',
      border: '1px solid rgba(0,0,0,.08)',
      borderRadius: 'var(--radius-pill)',
      padding: '0 20px',
      width: 280,
      whiteSpace: 'nowrap'
    }
  }, /*#__PURE__*/React.createElement("span", {
    style: {
      fontSize: 14,
      color: 'var(--color-ink-muted-48)'
    }
  }, "\uD83D\uDD0D"), /*#__PURE__*/React.createElement("input", {
    value: value,
    onChange: onChange,
    placeholder: placeholder,
    style: {
      border: 'none',
      outline: 'none',
      flex: 1,
      fontFamily: 'var(--font-text)',
      fontSize: 'var(--type-body-size)',
      color: 'var(--color-ink)',
      background: 'transparent'
    }
  }));
}
Object.assign(__ds_scope, { SearchInput });
})(); } catch (e) { __ds_ns.__errors.push({ path: "components/forms/SearchInput.jsx", error: String((e && e.message) || e) }); }

// components/navigation/Footer.jsx
try { (() => {
function Footer({
  columns = [{
    heading: 'Shop',
    links: ['Overview', 'Compare', 'Financing']
  }, {
    heading: 'Support',
    links: ['Contact Us', 'Repairs', 'Community']
  }]
}) {
  return /*#__PURE__*/React.createElement("footer", {
    style: {
      background: 'var(--color-canvas-parchment)',
      padding: '64px 24px',
      fontFamily: 'var(--font-text)'
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'flex',
      gap: 48,
      flexWrap: 'wrap'
    }
  }, columns.map(c => /*#__PURE__*/React.createElement("div", {
    key: c.heading
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      fontSize: 'var(--type-caption-strong-size)',
      fontWeight: 'var(--type-caption-strong-weight)',
      color: 'var(--color-ink)',
      marginBottom: 8
    }
  }, c.heading), /*#__PURE__*/React.createElement("div", {
    style: {
      fontSize: 'var(--type-dense-link-size)',
      lineHeight: 'var(--type-dense-link-lh)',
      color: 'var(--color-ink-muted-80)'
    }
  }, c.links.map(l => /*#__PURE__*/React.createElement("div", {
    key: l
  }, l)))))), /*#__PURE__*/React.createElement("div", {
    style: {
      marginTop: 32,
      fontSize: 'var(--type-fine-print-size)',
      color: 'var(--color-ink-muted-48)'
    }
  }, "Copyright \xA9 2026 Aperture Inc. All rights reserved."));
}
Object.assign(__ds_scope, { Footer });
})(); } catch (e) { __ds_ns.__errors.push({ path: "components/navigation/Footer.jsx", error: String((e && e.message) || e) }); }

// components/navigation/GlobalNav.jsx
try { (() => {
function GlobalNav({
  links = ['Store', 'Mac', 'iPad', 'Watch', 'Vision', 'TV & Home', 'Support'],
  brand = 'Aperture'
}) {
  return /*#__PURE__*/React.createElement("nav", {
    style: {
      background: 'var(--color-surface-black)',
      height: 44,
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'space-between',
      padding: '0 20px',
      fontFamily: 'var(--font-text)'
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'flex',
      alignItems: 'center',
      gap: 24
    }
  }, /*#__PURE__*/React.createElement("span", {
    style: {
      color: '#fff',
      fontSize: 16,
      fontWeight: 600
    }
  }, brand), /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'flex',
      gap: 20
    }
  }, links.map(l => /*#__PURE__*/React.createElement("span", {
    key: l,
    style: {
      color: '#fff',
      fontSize: 'var(--type-nav-link-size)',
      letterSpacing: 'var(--type-nav-link-ls)',
      opacity: 0.85
    }
  }, l)))), /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'flex',
      gap: 16,
      color: '#fff',
      fontSize: 14
    }
  }, /*#__PURE__*/React.createElement("span", null, "\uD83D\uDD0D"), /*#__PURE__*/React.createElement("span", null, "\uD83D\uDEB4")));
}
Object.assign(__ds_scope, { GlobalNav });
})(); } catch (e) { __ds_ns.__errors.push({ path: "components/navigation/GlobalNav.jsx", error: String((e && e.message) || e) }); }

// components/navigation/SubNavFrosted.jsx
try { (() => {
function SubNavFrosted({
  category = 'Aperture Phone',
  links = ['Overview', 'Tech Specs'],
  cta
}) {
  return /*#__PURE__*/React.createElement("div", {
    style: {
      background: 'rgba(245,245,247,.8)',
      backdropFilter: 'var(--blur-frost)',
      WebkitBackdropFilter: 'var(--blur-frost)',
      height: 52,
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'space-between',
      padding: '0 24px',
      fontFamily: 'var(--font-text)',
      borderBottom: 'var(--border-hairline)'
    }
  }, /*#__PURE__*/React.createElement("span", {
    style: {
      fontSize: 'var(--type-tagline-size)',
      fontWeight: 'var(--type-tagline-weight)',
      color: 'var(--color-ink)'
    }
  }, category), /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'flex',
      alignItems: 'center',
      gap: 20
    }
  }, links.map(l => /*#__PURE__*/React.createElement("span", {
    key: l,
    style: {
      fontSize: 'var(--type-button-utility-size)',
      color: 'var(--color-ink)'
    }
  }, l)), cta));
}
Object.assign(__ds_scope, { SubNavFrosted });
})(); } catch (e) { __ds_ns.__errors.push({ path: "components/navigation/SubNavFrosted.jsx", error: String((e && e.message) || e) }); }

// components/tiles/ProductTile.jsx
try { (() => {
const tones = {
  light: {
    bg: 'var(--color-canvas)',
    text: 'var(--color-ink)'
  },
  parchment: {
    bg: 'var(--color-canvas-parchment)',
    text: 'var(--color-ink)'
  },
  dark: {
    bg: 'var(--color-surface-tile-1)',
    text: '#fff'
  },
  'dark-2': {
    bg: 'var(--color-surface-tile-2)',
    text: '#fff'
  },
  'dark-3': {
    bg: 'var(--color-surface-tile-3)',
    text: '#fff'
  }
};
function ProductTile({
  tone = 'light',
  eyebrow,
  title,
  tagline,
  primaryCta,
  secondaryCta,
  media
}) {
  const t = tones[tone] || tones.light;
  const isDark = tone !== 'light' && tone !== 'parchment';
  return /*#__PURE__*/React.createElement("section", {
    style: {
      background: t.bg,
      color: t.text,
      padding: 'var(--space-section) 24px',
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      textAlign: 'center',
      gap: 16,
      fontFamily: 'var(--font-display)'
    }
  }, eyebrow && /*#__PURE__*/React.createElement("div", {
    style: {
      fontFamily: 'var(--font-text)',
      fontSize: 'var(--type-tagline-size)',
      fontWeight: 'var(--type-tagline-weight)',
      opacity: isDark ? 0.85 : 0.7
    }
  }, eyebrow), /*#__PURE__*/React.createElement("h2", {
    style: {
      margin: 0,
      fontSize: 'var(--type-display-lg-size)',
      fontWeight: 'var(--type-display-lg-weight)',
      lineHeight: 'var(--type-display-lg-lh)'
    }
  }, title), tagline && /*#__PURE__*/React.createElement("p", {
    style: {
      margin: 0,
      fontFamily: 'var(--font-text)',
      fontSize: 'var(--type-lead-size)',
      fontWeight: 'var(--type-lead-weight)',
      lineHeight: 'var(--type-lead-lh)',
      maxWidth: 640
    }
  }, tagline), (primaryCta || secondaryCta) && /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'flex',
      gap: 16,
      marginTop: 8
    }
  }, secondaryCta, primaryCta), media && /*#__PURE__*/React.createElement("div", {
    style: {
      marginTop: 40,
      width: '100%',
      display: 'flex',
      justifyContent: 'center'
    }
  }, media));
}
Object.assign(__ds_scope, { ProductTile });
})(); } catch (e) { __ds_ns.__errors.push({ path: "components/tiles/ProductTile.jsx", error: String((e && e.message) || e) }); }

// ui_kits/marketing/Homepage.jsx
try { (() => {
function Phone({
  tint = '#3a3a3c'
}) {
  return /*#__PURE__*/React.createElement("div", {
    style: {
      width: 220,
      height: 440,
      borderRadius: 42,
      background: tint,
      boxShadow: 'var(--shadow-product)',
      position: 'relative'
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      position: 'absolute',
      inset: 10,
      borderRadius: 34,
      background: 'rgba(0,0,0,.25)'
    }
  }));
}
function Watch({
  tint = '#8a8a8e'
}) {
  return /*#__PURE__*/React.createElement("div", {
    style: {
      width: 140,
      height: 170,
      borderRadius: 36,
      background: tint,
      boxShadow: 'var(--shadow-product)'
    }
  });
}
function Buds() {
  return /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'flex',
      gap: 16
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      width: 60,
      height: 90,
      borderRadius: 30,
      background: '#fafafc',
      boxShadow: 'var(--shadow-product)'
    }
  }), /*#__PURE__*/React.createElement("div", {
    style: {
      width: 60,
      height: 90,
      borderRadius: 30,
      background: '#fafafc',
      boxShadow: 'var(--shadow-product)'
    }
  }));
}
function Homepage() {
  const {
    GlobalNav,
    Footer,
    ProductTile,
    ButtonPrimary,
    ButtonSecondaryPill,
    StoreUtilityCard,
    EnvironmentQuoteCard
  } = window.AppleStyleDesignSystem_9d4645;
  const [added, setAdded] = React.useState(null);
  return /*#__PURE__*/React.createElement("div", {
    style: {
      background: '#fff'
    }
  }, /*#__PURE__*/React.createElement(GlobalNav, null), /*#__PURE__*/React.createElement(ProductTile, {
    tone: "light",
    eyebrow: "Aperture Phone",
    title: "Impossibly capable.",
    tagline: "A leap forward in every way that matters, in a shape that fits your hand.",
    primaryCta: /*#__PURE__*/React.createElement(ButtonPrimary, {
      onClick: () => setAdded('Aperture Phone')
    }, "Buy"),
    secondaryCta: /*#__PURE__*/React.createElement(ButtonSecondaryPill, null, "Learn more"),
    media: /*#__PURE__*/React.createElement(Phone, {
      tint: "#e8e6df"
    })
  }), /*#__PURE__*/React.createElement(ProductTile, {
    tone: "dark",
    eyebrow: "Aperture Watch",
    title: "Time, well kept.",
    tagline: "Your most personal device yet, redesigned from the inside out.",
    primaryCta: /*#__PURE__*/React.createElement(ButtonPrimary, {
      onClick: () => setAdded('Aperture Watch')
    }, "Buy"),
    secondaryCta: /*#__PURE__*/React.createElement(ButtonSecondaryPill, null, "Learn more"),
    media: /*#__PURE__*/React.createElement(Watch, null)
  }), /*#__PURE__*/React.createElement("section", {
    style: {
      background: 'var(--color-canvas-parchment)',
      padding: '80px 24px',
      fontFamily: 'var(--font-display)'
    }
  }, /*#__PURE__*/React.createElement("h2", {
    style: {
      textAlign: 'center',
      fontSize: 'var(--type-display-lg-size)',
      fontWeight: 'var(--type-display-lg-weight)',
      color: 'var(--color-ink)',
      marginBottom: 40
    }
  }, "Shop accessories"), /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'flex',
      gap: 24,
      justifyContent: 'center',
      flexWrap: 'wrap'
    }
  }, /*#__PURE__*/React.createElement(StoreUtilityCard, {
    name: "Silicone Case",
    price: "$49",
    image: /*#__PURE__*/React.createElement("div", {
      style: {
        width: 70,
        height: 70,
        borderRadius: 12,
        background: '#d7d5cd'
      }
    })
  }), /*#__PURE__*/React.createElement(StoreUtilityCard, {
    name: "Braided Cable",
    price: "$29",
    image: /*#__PURE__*/React.createElement("div", {
      style: {
        width: 70,
        height: 70,
        borderRadius: 12,
        background: '#c9c7bf'
      }
    })
  }), /*#__PURE__*/React.createElement(StoreUtilityCard, {
    name: "Fast Charger",
    price: "$39",
    image: /*#__PURE__*/React.createElement("div", {
      style: {
        width: 70,
        height: 70,
        borderRadius: 12,
        background: '#dedcd4'
      }
    })
  }))), /*#__PURE__*/React.createElement(ProductTile, {
    tone: "dark-2",
    eyebrow: "Aperture Buds",
    title: "Sound, refined.",
    tagline: "Adaptive audio that listens to the room, not just your ears.",
    primaryCta: /*#__PURE__*/React.createElement(ButtonPrimary, {
      onClick: () => setAdded('Aperture Buds')
    }, "Buy"),
    secondaryCta: /*#__PURE__*/React.createElement(ButtonSecondaryPill, null, "Learn more"),
    media: /*#__PURE__*/React.createElement(Buds, null)
  }), /*#__PURE__*/React.createElement(EnvironmentQuoteCard, {
    title: "Our goal: every device, carbon neutral by 2030.",
    cta: /*#__PURE__*/React.createElement(ButtonPrimary, null, "Learn more")
  }), /*#__PURE__*/React.createElement(Footer, null), added && /*#__PURE__*/React.createElement("div", {
    style: {
      position: 'fixed',
      bottom: 24,
      left: '50%',
      transform: 'translateX(-50%)',
      background: 'var(--color-ink)',
      color: '#fff',
      padding: '12px 20px',
      borderRadius: 'var(--radius-pill)',
      fontFamily: 'var(--font-text)',
      fontSize: 14
    },
    onClick: () => setAdded(null)
  }, added, " added to Bag"));
}
window.Homepage = Homepage;
})(); } catch (e) { __ds_ns.__errors.push({ path: "ui_kits/marketing/Homepage.jsx", error: String((e && e.message) || e) }); }

// ui_kits/store/AccessoriesPage.jsx
try { (() => {
function AccessoriesPage() {
  const {
    GlobalNav,
    SubNavFrosted,
    SearchInput,
    StoreUtilityCard,
    Footer
  } = window.AppleStyleDesignSystem_9d4645;
  const items = [{
    name: 'Silicone Case',
    price: '$49'
  }, {
    name: 'Braided Cable',
    price: '$29'
  }, {
    name: 'Fast Charger',
    price: '$39'
  }, {
    name: 'Leather Wallet',
    price: '$59'
  }, {
    name: 'Wireless Charger',
    price: '$99'
  }, {
    name: 'Screen Protector',
    price: '$19'
  }];
  const [q, setQ] = React.useState('');
  const filtered = items.filter(i => i.name.toLowerCase().includes(q.toLowerCase()));
  return /*#__PURE__*/React.createElement("div", {
    style: {
      background: '#fff'
    }
  }, /*#__PURE__*/React.createElement(GlobalNav, null), /*#__PURE__*/React.createElement(SubNavFrosted, {
    category: "Accessories",
    links: [],
    cta: /*#__PURE__*/React.createElement(SearchInput, {
      value: q,
      onChange: e => setQ(e.target.value),
      placeholder: "Search accessories"
    })
  }), /*#__PURE__*/React.createElement("div", {
    style: {
      padding: '48px 24px',
      display: 'flex',
      gap: 24,
      flexWrap: 'wrap',
      justifyContent: 'center',
      minHeight: 300
    }
  }, filtered.map(i => /*#__PURE__*/React.createElement(StoreUtilityCard, {
    key: i.name,
    name: i.name,
    price: i.price,
    image: /*#__PURE__*/React.createElement("div", {
      style: {
        width: 70,
        height: 70,
        borderRadius: 12,
        background: '#e2e0d8'
      }
    })
  })), filtered.length === 0 && /*#__PURE__*/React.createElement("div", {
    style: {
      color: 'var(--color-ink-muted-48)',
      fontFamily: 'var(--font-text)'
    }
  }, "No results.")), /*#__PURE__*/React.createElement(Footer, null));
}
window.AccessoriesPage = AccessoriesPage;
})(); } catch (e) { __ds_ns.__errors.push({ path: "ui_kits/store/AccessoriesPage.jsx", error: String((e && e.message) || e) }); }

// ui_kits/store/BuyPage.jsx
try { (() => {
function BuyPage() {
  const {
    GlobalNav,
    SubNavFrosted,
    ButtonPrimary,
    ConfiguratorOptionChip,
    FloatingStickyBar
  } = window.AppleStyleDesignSystem_9d4645;
  const colors = [{
    l: 'Slate',
    d: 0
  }, {
    l: 'Parchment',
    d: 0
  }, {
    l: 'Midnight',
    d: 0
  }, {
    l: 'Coral',
    d: 50
  }];
  const storage = [{
    l: '128GB',
    d: 0
  }, {
    l: '256GB',
    d: 100
  }, {
    l: '512GB',
    d: 300
  }];
  const [color, setColor] = React.useState(0);
  const [stor, setStor] = React.useState(0);
  const base = 899;
  const total = base + colors[color].d + storage[stor].d;
  return /*#__PURE__*/React.createElement("div", {
    style: {
      background: '#fff',
      paddingBottom: 64
    }
  }, /*#__PURE__*/React.createElement(GlobalNav, null), /*#__PURE__*/React.createElement(SubNavFrosted, {
    category: "Aperture Phone",
    links: ['Overview', 'Tech Specs'],
    cta: /*#__PURE__*/React.createElement(ButtonPrimary, null, "Buy")
  }), /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'flex',
      justifyContent: 'center',
      padding: '48px 0',
      background: 'var(--color-canvas-parchment)'
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      width: 240,
      height: 480,
      borderRadius: 44,
      background: color === 3 ? '#c0674f' : color === 2 ? '#2a2a2c' : color === 1 ? '#f0efe9' : '#8a8a8e',
      boxShadow: 'var(--shadow-product)'
    }
  })), /*#__PURE__*/React.createElement("div", {
    style: {
      maxWidth: 640,
      margin: '0 auto',
      padding: '48px 24px',
      fontFamily: 'var(--font-text)'
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      fontSize: 'var(--type-tagline-size)',
      fontWeight: 'var(--type-tagline-weight)',
      color: 'var(--color-ink)',
      marginBottom: 16
    }
  }, "Finish"), /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'flex',
      gap: 10,
      flexWrap: 'wrap',
      marginBottom: 40
    }
  }, colors.map((c, i) => /*#__PURE__*/React.createElement(ConfiguratorOptionChip, {
    key: c.l,
    label: c.l,
    priceDelta: c.d ? `+$${c.d}` : undefined,
    selected: color === i,
    onClick: () => setColor(i)
  }))), /*#__PURE__*/React.createElement("div", {
    style: {
      fontSize: 'var(--type-tagline-size)',
      fontWeight: 'var(--type-tagline-weight)',
      color: 'var(--color-ink)',
      marginBottom: 16
    }
  }, "Storage"), /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'flex',
      gap: 10,
      flexWrap: 'wrap'
    }
  }, storage.map((s, i) => /*#__PURE__*/React.createElement(ConfiguratorOptionChip, {
    key: s.l,
    label: s.l,
    priceDelta: s.d ? `+$${s.d}` : undefined,
    selected: stor === i,
    onClick: () => setStor(i)
  })))), /*#__PURE__*/React.createElement(FloatingStickyBar, {
    price: `$${total}`,
    cta: /*#__PURE__*/React.createElement(ButtonPrimary, null, "Add to Bag")
  }));
}
window.BuyPage = BuyPage;
})(); } catch (e) { __ds_ns.__errors.push({ path: "ui_kits/store/BuyPage.jsx", error: String((e && e.message) || e) }); }

__ds_ns.ButtonDarkUtility = __ds_scope.ButtonDarkUtility;

__ds_ns.ButtonIconCircular = __ds_scope.ButtonIconCircular;

__ds_ns.ButtonPearlCapsule = __ds_scope.ButtonPearlCapsule;

__ds_ns.ButtonPrimary = __ds_scope.ButtonPrimary;

__ds_ns.ButtonSecondaryPill = __ds_scope.ButtonSecondaryPill;

__ds_ns.TextLink = __ds_scope.TextLink;

__ds_ns.TextLinkOnDark = __ds_scope.TextLinkOnDark;

__ds_ns.EnvironmentQuoteCard = __ds_scope.EnvironmentQuoteCard;

__ds_ns.StoreUtilityCard = __ds_scope.StoreUtilityCard;

__ds_ns.ConfiguratorOptionChip = __ds_scope.ConfiguratorOptionChip;

__ds_ns.FloatingStickyBar = __ds_scope.FloatingStickyBar;

__ds_ns.SearchInput = __ds_scope.SearchInput;

__ds_ns.Footer = __ds_scope.Footer;

__ds_ns.GlobalNav = __ds_scope.GlobalNav;

__ds_ns.SubNavFrosted = __ds_scope.SubNavFrosted;

__ds_ns.ProductTile = __ds_scope.ProductTile;

})();
