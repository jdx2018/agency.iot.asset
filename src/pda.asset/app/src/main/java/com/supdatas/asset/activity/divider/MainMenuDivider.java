package com.supdatas.asset.activity.divider;

import android.graphics.Canvas;
import android.graphics.Rect;
import android.graphics.drawable.ColorDrawable;
import android.graphics.drawable.Drawable;
import android.support.v7.widget.LinearLayoutManager;
import android.support.v7.widget.RecyclerView;
import android.view.View;

public class MainMenuDivider extends RecyclerView.ItemDecoration {

	private Drawable mDivider;

	private int leftMargin, rightMargin, topMargin, bottomMargin;

	private int width, height;

	private int mOrientation;

	private int spanCount; 			//列数
	private int spacing; 			//间隔
	private boolean includeEdge; 	//是否包含边缘

	public MainMenuDivider(Drawable divider, int orientation,
						   int column, int spacing1, boolean includeEdge1) {
		setDivider(divider);
		setOrientation(orientation);

		spanCount = column;
		spacing = spacing1;
		includeEdge = includeEdge1;
	}

	private void setDivider(Drawable divider) {
		this.mDivider = divider;
		if (mDivider == null) {
			mDivider = new ColorDrawable(0xffff0000);
		}
		width = mDivider.getIntrinsicWidth();
		height = mDivider.getIntrinsicHeight();
	}

	private void setOrientation(int orientation) {
		if (orientation != LinearLayoutManager.HORIZONTAL && orientation != LinearLayoutManager.VERTICAL) {
			throw new IllegalArgumentException("invalid orientation");
		}
		mOrientation = orientation;
	}

	public void setMargin(int left, int top, int right, int bottom) {
		this.leftMargin = left;
		this.topMargin = top;
		this.rightMargin = right;
		this.bottomMargin = bottom;
	}

	public void setHeight(int height) {
		this.height = height;
	}

	public void setWidth(int width) {
		this.width = width;
	}

	public int getHeight() {
		return height;
	}

	public int getWidth() {
		return width;
	}

	@Override
	public void onDraw(Canvas c, RecyclerView parent, RecyclerView.State state) {
		super.onDraw(c, parent, state);
		if (mOrientation == LinearLayoutManager.HORIZONTAL) {
			drawHorizontal(c, parent);
		} else {
			drawVertical(c, parent);
		}
	}

	public void drawHorizontal(Canvas c, RecyclerView parent) {
		final int top = parent.getPaddingTop() + topMargin;
		final int bottom = parent.getHeight() - parent.getPaddingBottom() - bottomMargin;

		final int childCount = parent.getChildCount();
		for (int i = 0; i < childCount; i++) {
			final View child = parent.getChildAt(i);
			final RecyclerView.LayoutParams params = (RecyclerView.LayoutParams) child
					.getLayoutParams();
			final int left = child.getRight() + params.rightMargin + leftMargin;
			final int right = left + width;
			mDivider.setBounds(left, top, right, bottom);
			mDivider.draw(c);
		}
	}

	public void drawVertical(Canvas c, RecyclerView parent) {
		final int left = parent.getPaddingLeft() + leftMargin;
		final int right = parent.getWidth() - parent.getPaddingRight() - rightMargin;

		final int childCount = parent.getChildCount();
		for (int i = 0; i < childCount; i++) {
			final View child = parent.getChildAt(i);
			final RecyclerView.LayoutParams params = (RecyclerView.LayoutParams) child.getLayoutParams();
			final int top = child.getBottom() + params.bottomMargin + topMargin;
			final int bottom = top + height;
			mDivider.setBounds(left, top, right, bottom);
			mDivider.draw(c);
		}
	}

	/*@Override
	public void getItemOffsets(Rect outRect, View view, RecyclerView parent, RecyclerView.State state) {
		super.getItemOffsets(outRect, view, parent, state);
		if (mOrientation == LinearLayoutManager.HORIZONTAL) {
			outRect.set(0, 0, leftMargin + width + rightMargin, 0);
		} else {
			outRect.set(0, 0, 0, topMargin + height + bottomMargin);
		}
	}*/

	@Override
	public void getItemOffsets(Rect outRect, View view, RecyclerView parent, RecyclerView.State state) {

		//这里是关键，需要根据你有几列来判断
		int position = parent.getChildAdapterPosition(view); // item position
		int column = position % spanCount; // item column

		if (includeEdge) {
			outRect.left = spacing - column * spacing / spanCount; // spacing - column * ((1f / spanCount) * spacing)
			outRect.right = (column + 1) * spacing / spanCount; // (column + 1) * ((1f / spanCount) * spacing)

			if (position < spanCount) { // top edge
				outRect.top = spacing;
			}
			outRect.bottom = spacing; // item bottom
		} else {
			outRect.left = column * spacing / spanCount; // column * ((1f / spanCount) * spacing)
			outRect.right = spacing - (column + 1) * spacing / spanCount; // spacing - (column + 1) * ((1f /    spanCount) * spacing)
			if (position >= spanCount) {
				outRect.top = spacing; // item top
			}
		}
	}
}
