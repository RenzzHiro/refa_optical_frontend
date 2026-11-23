import { Link } from "react-router-dom";
import type { Product } from "../types";
import { formatCurrency } from "../utils/format";
export default function ProductCard({ product }: { product: Product }) {
  const discount = product.compareAtPrice
    ? Math.round((1 - product.price / product.compareAtPrice) * 100)
    : 0;
  return (
    <article className="product-card">
      <Link to={`/products/${product.slug}`} className="product-image-wrap">
        <img
          src={product.image}
          alt={`Kacamata ${product.name}`}
          className="product-image"
          loading="lazy"
        />
        {product.isNew && <span className="product-tag">Baru</span>}
        {discount > 0 && <span className="product-discount">-{discount}%</span>}
      </Link>
      <div className="product-info">
        <div className="product-title-row">
          <Link to={`/products/${product.slug}`} className="product-name">
            {product.name}
          </Link>
          <span className="product-frame-label">{product.frame}</span>
        </div>
        <div className="product-meta-row">
          <div
            className="swatches"
            aria-label={`Pilihan warna ${product.name}`}
          >
            {product.colors.slice(0, 3).map((c) => (
              <span
                key={c.name}
                className="swatch"
                title={c.name}
                style={{ backgroundColor: c.hex }}
              />
            ))}
            {product.colors.length > 3 && (
              <span className="swatch-more">+{product.colors.length - 3}</span>
            )}
          </div>
          <div className="product-prices">
            <strong>{formatCurrency(product.price)}</strong>
            {product.compareAtPrice && (
              <del>{formatCurrency(product.compareAtPrice)}</del>
            )}
          </div>
        </div>
      </div>
    </article>
  );
}
