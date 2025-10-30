import React from "react";
import { Clock, Star, BookOpen } from "lucide-react";
import "./ProductPage.css";

function ProductPage() {
  const rating = 4.5;

  return (
    <div className="product-page product-page--center">
      <div className="product-card">
        <div className="product-card__header">
          <div className="product-card__icon-wrap">
            <BookOpen className="product-card__icon" />
          </div>
        </div>

        <div className="product-card__content">
          <div className="product-card__tag">GOAT</div>

          <h2 className="product-card__title">NISM Series I: Currency Derivatives</h2>
          <p className="product-card__subtitle">Learn currency derivatives trading</p>

          <div className="product-card__meta">
            <span className="meta-item">
              <Clock size={14} className="meta-item__icon" />
              <span>40h</span>
            </span>
            <span className="badge badge--level">Intermediate</span>
          </div>

          <div className="product-card__rating">
            {Array.from({ length: 5 }).map((_, i) => (
              <Star
                key={i}
                size={14}
                className="star"
                fill={i < Math.floor(rating) ? "#FCD34D" : "none"}
                color="#FCD34D"
              />
            ))}
            <span className="rating-value">(4.5)</span>
          </div>
        </div>

        <div className="product-card__footer">
          <div className="enroll-now">Enroll Now</div>
          <button className="buy-btn">Buy</button>
        </div>
      </div>
    </div>
  );
}

export default ProductPage;

