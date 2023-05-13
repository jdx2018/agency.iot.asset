package com.supdatas.asset.frame.adapter;

import android.content.Context;
import android.view.LayoutInflater;
import android.view.View;
import android.view.ViewGroup;
import android.widget.BaseAdapter;
import android.widget.ImageView;
import android.widget.TextView;

import com.supdatas.asset.R;

public class MenuListAdapter extends BaseAdapter {

	private Context mContext;
	private int[] iArrIconIds;
	private int[] iArrTextIds;

	public MenuListAdapter(Context context, int[] iArrIconIds, int[] iArrTextIds) {
		mContext = context;
		this.iArrIconIds = iArrIconIds;
		this.iArrTextIds = iArrTextIds;
	}

	@Override
	public int getCount() {
		// TODO Auto-generated method stub
		return iArrTextIds == null ? 0 : iArrTextIds.length;
	}

	@Override
	public Object getItem(int position) {
		// TODO Auto-generated method stub
		return iArrTextIds[position];
	}

	@Override
	public long getItemId(int position) {
		// TODO Auto-generated method stub
		return position;
	}

	@Override
	public View getView(int position, View convertView, ViewGroup parent) {
		// TODO Auto-generated method stub
		ViewHolder holder = null;
		if (convertView == null) {
			holder = new ViewHolder();
			convertView = LayoutInflater.from(mContext).inflate(
					R.layout.layout_list_item_menu, null);
			holder.ivIcon = (ImageView) convertView.findViewById(R.id.iv_menu);
			holder.tvTitle = (TextView) convertView.findViewById(R.id.tv_menu);

			convertView.setTag(holder);
		} else {
			holder = (ViewHolder) convertView.getTag();
		}

		holder.ivIcon.setBackgroundResource(iArrIconIds[position]);
		holder.tvTitle.setText(mContext.getString(iArrTextIds[position]));

		return convertView;
	}

	public final class ViewHolder {
		public ImageView ivIcon;
		public TextView tvTitle;
	}

}
